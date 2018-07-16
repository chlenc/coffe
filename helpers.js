const database = require('./database');
const kb = require('./keyboard-buttons');
const keyboard = require('./keyboard');
const frases = require('./frases');
const cache = require('memory-cache');
const applicationChatId = '-243442467';


module.exports = {

    getCacheLog(id) {
        var data = cache.get(id)
        console.log(data)
        return data
    },

    init(id) {
        cache.put(id, {
            category: '',
            basket:
                [
                    {unit: '64c5', category: 'coffee', syrups: ['d5de', 'eef5'], tare: 'cup'},
                    {unit: '59f5', category: 'smhs', tare: 'but'},
                    {unit: '2b28', category: 'milks', tare: 'cup'}
                ]

            // category: 'smhs', order: {items: ['141a']}
        })

    },

    start(chat) {
        database.setData(`users/${chat.id}`, chat)
    },
    addContact(bot, msg) {
        var chatId = msg.chat.id;
        database.updateData('users/' + chatId, {phone_number: msg.contact.phone_number});
        bot.sendMessage(
            applicationChatId,
            `${getDateTime()}\n<b>Новый клиент:</b>\n\nИмя: <a href="tg://user?id` +
            `=${msg.chat.id}">${msg.chat.first_name}</a>\nНомер: ${msg.contact.phone_number}`,
            {parse_mode: 'HTML'});

        bot.sendMessage(chatId, frases.welcome(msg.chat.first_name), {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(function () {
            setTimeout(function () {
                sendHome(bot, chatId)
            }, 500)

        })
    },
    sendHome(bot, chatId) {
        bot.sendPhoto(chatId, frases.label_url, {
                caption: frases.home,
                reply_markup: keyboard.home.reply_markup

            }
        )
    },
    clearCategory(chatId) {
        var temp = cache.get(chatId);
        temp.category = '';
        cache.put(chatId, temp)

    },
    clearBasket(chatId) {
        var temp = cache.get(chatId);
        temp.basket = [];
        cache.put(chatId, temp)

    },
    getCategory(chatId) {
        return cache.get(chatId).category
    },
    sendSyrups(bot, chatId, unitId) {
        var temp = cache.get(chatId);
        if (temp.order === undefined) {
            temp.order = {unit: unitId, category: temp.category, syrups: []};
            cache.put(chatId, temp);
        }
        database.getData('syrops/').then(function (data) {
            bot.sendMessage(chatId, 'Выберите сиропы', keyboard.syropsKeyboard(data.val(), (temp.order.syrups)))
        })
    },
    addSyrup(bot, chatId, unitId) {
        var temp = cache.get(chatId);
        if (temp.order.syrups.indexOf(unitId) === -1)
            temp.order.syrups.push(unitId);
        else
            temp.order.syrups.splice(temp.order.syrups.indexOf(unitId), 1)
        cache.put(chatId, temp);
        database.getData('syrops/').then(function (data) {
            bot.sendMessage(chatId, 'Выберите сиропы', keyboard.syropsKeyboard(data.val(), (temp.order.syrups)))
        })
    },
    // addSmhs(bot, chatId, unitId) {
    //     var temp = cache.get(chatId);
    //     if (temp.order.items.indexOf(unitId) === -1)
    //         temp.order.items.push(unitId);
    //     else
    //         temp.order.items.splice(temp.order.items.indexOf(unitId), 1)
    //     cache.put(chatId, temp);
    //     database.getData('goods/' + temp.category).then(function (data) {
    //         bot.sendMessage(chatId, frases.titles[temp.category], keyboard.smhsKeyboard(data.val(), (temp.order.items)))
    //     })
    // },
    sendUnits(bot, id, category) {
        database.getData('goods/').then(function (data) {
            var goods = (data.val() === null) ? {} : data.val();
            if (goods[category] != null) {
                goods = goods[category];

                var cacheData = cache.get(id);
                cacheData = (cacheData === null) ? {} : cacheData
                cacheData.category = category;


                var key = [];
                for (var temp in goods)
                    key.push([kb.unitButton(goods[temp])])
                key.push([kb.back_to_categories, kb.back_to_home]);
                cache.put(id, cacheData)

                bot.sendMessage(id, frases.titles[category], {
                    reply_markup: {
                        inline_keyboard: key
                    }
                })

            } else {
                bot.sendMessage(id, frases.empty, keyboard.categories)
            }

        })
    },
    addToBasket(bot, chatId, tare) {
        var temp = cache.get(chatId);
        temp.order.tare = tare;

        if (temp.basket === undefined) {
            temp.basket = [temp.order]
        } else {
            temp.basket.push(temp.order)
        }
        delete temp.order;
        cache.put(chatId, temp)
        bot.sendMessage(chatId, 'готово', keyboard.ready)
    },
    basket(bot, chatId) {
        database.getData('goodsById/').then(function (data) {
            var data = data.val();
            var basket = (cache.get(chatId) == null) ? [] : cache.get(chatId).basket;
            if (basket === []) {
                bot.sendMessage(chatId, frases.empty, keyboard.emptyBasket)
            }
            else {
                database.getData('syrops/').then(function (syrops) {
                    bot.sendMessage(chatId, getCheck(basket, data, syrops.val()), keyboard.basket)
                })
            }
        })
    },
    submitOrder(bot, chatId) {
        database.getData(`/goodsById`).then(data => {
            var data = (data.val() === null) ? {} : data.val();
            var basket = (cache.get(chatId) == null) ? [] : cache.get(chatId).basket;
            database.getData('syrops/').then(function (syrops) {
                var check = getCheck(basket, data, syrops.val())
                database.getData('users/' + chatId).then(function (user) {
                    user = user.val()
                    var uid = getUid();
                    var text = `${getDateTime()}\n<b>Новый заказ:</b>\n\nИмя: <a href="tg://user?id` +
                        `=${chatId}">${user.first_name}</a>\nНомер: ${user.phone_number}\n\nЗаказ #${uid}:\n` + check;

                    bot.sendMessage(applicationChatId, text, {parse_mode: 'HTML'})
                    var text = `<b>Номер вашего заказа: #${uid}\nПокажите этот номер на кассе чтоб забрать заказ:</b>\n\n${check}`;
                    bot.sendMessage(chatId, text, keyboard.home)
                    cache.del(chatId)
                });
            })

        })
    },
    tareAsk(bot, chatId, unitId) {
        var temp = cache.get(chatId);
        if (temp.category === 'smhs' || temp.category === 'fresh') {
            bot.sendMessage(chatId, 'Вам налить в бутылку или в стакан?', keyboard.bottle_ask({id: unitId}))
        } else {
            bot.sendMessage(chatId, 'Вы уверены?', keyboard.just_ask({id: unitId}))
        }
        // temp.order = (temp.order === undefined)?{}:temp.order
        temp.order = {unit: unitId, category: temp.category};
        cache.put(chatId, temp)
    },

};

function getCheck(items, data, syrops) {
    var order = 'Чек\n\n';
    var price = 0;
    var item
    var map = {
        'coffee': 'Кофе',
        'smhs': "Смузи",
        'tea': 'Чай',
        'fresh':'Фреш',
        'milks':'Молочный коктейль',
        'drinks':'Сезонный напиток'
    }
    var cupMap = {
        cup: 'Стакан',
        but: 'Бутылка'
    }
    for (var temp in items) {
        item = items[temp];
        order += `${map[item.category]} ${data[item.unit].title} (${cupMap[item.tare]}) : ${data[item.unit].price}₽\n`;
        price += data[item.unit].price;
        if (item.syrups !== undefined) {
            for (var i = 0; i < item.syrups.length; i++) {
                order += `☕️ сироп ${syrops[item.syrups[i]].title}:  ${syrops[item.syrups[i]].price}₽\n`
                price += syrops[item.syrups[i]].price;
            }
        }
    }

    order += '\nИтоговая цена: ' + price + '₽';
    return order
}

function getCount(array) {
    var out = {};
    for (var i = 0; i < array.length; i++) {
        if (out[array[i]]) {
            out[array[i]] = out[array[i]] + 1
        } else {
            out[array[i]] = 1
        }
    }
    return out
}

function getUid() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


function sendHome(bot, chatId) {
    bot.sendPhoto(chatId, frases.label_url, {
            caption: frases.home,
            reply_markup: keyboard.home.reply_markup

        }
    )
}

function getDateTime() {
    var date = new Date();
    return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var j = 0;
    for (var i = 0; i < a.length; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function uni(arr) {

    var result = arr.reduce(function (acc, el) {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
    }, {});
    var out = [];
    for (var temp in result) {
        if (result[temp] == 1)
            out.push(temp);
    }
    return (out)
}
