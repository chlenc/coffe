const TelegramBot = require('node-telegram-bot-api');
const token = '553624068:AAEp_a77CNsbRDYnnXukiEqrMyj08ix8TRc';
const bot = new TelegramBot(token, {polling: true});
//люблю пуса
const helpers = require('./helpers');
const keyboard = require('./keyboard');
const kb = require('./keyboard-buttons');
const frases = require('./frases');


bot.onText(/\/start/, function (msg) {
    helpers.start(msg.chat);
    bot.sendMessage(msg.chat.id, frases.phone, keyboard.phone);
});

bot.onText(/\/chatId/, function (msg) {
    bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/\/init/, function (msg) {
    helpers.init(msg.chat.id);
});
bot.onText(/\/log/, function (msg) {
    bot.sendMessage(msg.chat.id, 'cache: ' + JSON.stringify(helpers.getCacheLog(msg.chat.id),null,4));
});

bot.on('message', function (msg) {
    if (msg.contact) {
        helpers.addContact(bot, msg);
    }
});

bot.on('callback_query', function (query) {
        const {chat, message_id, text} = query.message;
        console.log(query.data)
        switch (query.data) {
            case kb.home.about_company.callback_data:                           //about_company
                bot.sendMessage(chat.id, frases.about_company, keyboard.home);
                break;
            case kb.home.about_stock.callback_data :                            //about_stock
                bot.sendMessage(chat.id, frases.about_stock, keyboard.home);
                break;
            case kb.feedback.callback_data :                                    //feedback
                bot.sendMessage(chat.id, frases.feedback_text, keyboard.home);
                break;
            case (kb.home.order.callback_data):                                 //order
                bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
                break;
            case (kb.back_to_categories.callback_data):                         //back_to_categories
                bot.sendMessage(chat.id, frases.menu_title, keyboard.categories);
                    break;
            case kb.back_to_home.callback_data :                                //back_to_home
                helpers.sendHome(bot, chat.id);
                helpers.clearCategory(chat.id)
                break;
            case 'basket':                                                       //basket
                helpers.basket(bot, chat.id)
                break;
            case 'clearBasket':                                                       //clearBasket
                helpers.clearBasket(chat.id)
                helpers.basket(bot, chat.id)
                break;
            case kb.submitOrder.callback_data:                                  //submitOrder
                helpers.submitOrder(bot, chat.id)
                break;
            case 'coffee':
            case 'tea':
            case 'smhs':
            case 'fresh':
            case 'milks':
            case 'drinks':
                helpers.sendUnits(bot, chat.id, query.data);
                break;
            default:
                try {
                    var parceQuery = JSON.parse(query.data);
                    if (parceQuery.t === 'unit') {
                        var categ = helpers.getCategory(chat.id)
                        if (categ === "coffee") {
                            helpers.sendSyrups(bot, chat.id, parceQuery.id)
                        } else {
                            helpers.tareAsk(bot, chat.id, parceQuery.id)
                        }
                    } else if (parceQuery.t === 'ch') {
                        if (helpers.getCategory(chat.id) === "coffee") {
                            helpers.addSyrup(bot, chat.id, parceQuery.id)
                        }
                    }
                    else if (parceQuery.t === 'sub') {
                        helpers.addToBasket(bot, chat.id, parceQuery.cup)
                    }
                } catch (e) {
                     bot.sendMessage(chat.id, frases.error_message, keyboard.home)
                     // bot.sendMessage(chat.id, 'error: '+e.toString(), keyboard.home)
                }
                break;
        }

        helpers.getCacheLog(chat.id)
        try {
            bot.deleteMessage(chat.id, message_id);
        } catch (e) {
            console.log('delete error')
        }
    }
)


console.log('bot has been started')