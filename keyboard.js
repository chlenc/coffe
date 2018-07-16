const kb = require('./keyboard-buttons');
const frases = require('./frases');
module.exports = {
    phone: {
        reply_markup: {
            keyboard: [
                [{
                    text: 'Отправить номер',
                    request_contact: true
                }]
            ]
        }
    },
    home: {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [kb.home.order],
                [kb.feedback],
                [kb.home.about_stock],
                [kb.home.about_company]
            ]
        }
    },
    categories: {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Кофе',
                    callback_data: 'coffee'
                },
                    {
                        text: 'Чаи',
                        callback_data: 'tea'
                    }],
                [{
                    text: 'Смузи',
                    callback_data: 'smhs'

                }, {
                    text: 'Фреш',
                    callback_data: 'fresh'

                }],
                [{
                    text: 'Молочные коктейли',
                    callback_data: 'milks'

                }],
                [{
                    text: 'Сезонные напитки',
                    callback_data: 'drinks'
                }],
                [kb.back_to_home, kb.basket]
            ]
        }
    },
    basket: {
        reply_markup: {
            inline_keyboard: [[kb.submitOrder],
                [kb.clearBasket], [kb.back_to_home]]
        }
    },
    emptyBasket: {
        reply_markup: {
            inline_keyboard: [[kb.back_to_categories, kb.back_to_home]]
        }
    },
    smhsKeyboard(smhs, checked) {
        var key = []
        for (var temp in smhs)
            key.push([kb.checkButton(smhs[temp], (checked.indexOf(smhs[temp].id) !== -1))])
        key.push([kb.cup({}),kb.bottle({})],[kb.back_to_home])
        return {
            reply_markup: {
                inline_keyboard: key
            }
        }
    },
    syropsKeyboard(syrops, checked) {
        var key = []
        for (var temp in syrops)
            key.push([kb.checkButton(syrops[temp], (checked.indexOf(temp) !== -1))])
        key.push([kb.back_to_home, kb.just_yes({})])
        return {
            reply_markup: {
                inline_keyboard: key
            }
        }
    },

    bottle_ask(query) {
        var key = {
            reply_markup: {
                inline_keyboard: [
                    [kb.bottle(query), kb.cup(query)],
                    [kb.back_to_home]
                ]
            }
        }
        return key
    }, just_ask(query) {
        var key = {
            reply_markup: {
                inline_keyboard: [
                    [kb.just_yes(query)],
                    [kb.back_to_home]
                ]
            }
        }
        return key
    },
    ready: {
        reply_markup: {
            inline_keyboard: [
                [kb.basket],
                [kb.back_to_home]
            ]
        }
    }
}
