module.exports = {
    home: {
        order: {
            text: 'Сделать заказ',
            callback_data: 'order'
        },
        about_stock: {
            text: 'Об ассортименте',
            callback_data: 'about_stock'
        },
        about_company: {
            text: 'О компании',
            callback_data: 'about_company'
        }
    },
    back_to_home: {
        text: 'Домой 🏠',
        callback_data: 'back_to_home'
    },
    back_to_categories: {
        text: 'Сделать заказ',
        callback_data: 'back_to_categories'
    },
    feedback: {
        text: 'Написать директору',
        callback_data: 'feedback'
    },
    basket: {
            text: 'Заказ 🛒',
            callback_data: 'basket'
    },
    submitOrder: {
        text: 'Оформить заказ',
        callback_data: 'submitOrder'
    },
    clearBasket: {
        text: 'Очистить корзину 🗑',
        callback_data: 'clearBasket'
    },
    unitButton(unit) {
        return {
            text: unit.title + ' - ' + unit.price + '₽',
            callback_data: JSON.stringify({
                t: 'unit',
                id: unit.id
            })
        }
    },
    checkButton(unit,isChecked) {
        var text =(isChecked)?unit.title + ' - ' + unit.price + '₽  ✅': unit.title + ' - ' + unit.price + '₽  ';
        return {
            text: text,
            callback_data: JSON.stringify({
                t: 'ch',
                //c:category,
                id: unit.id
            })
        }
    },
    rebout(category) {
        return {
            text: 'Сбросить',
            callback_data: JSON.stringify({
                t: 'rebout',
                categ: category
            })
        }
    },
    ready(category,ids) {
        var key =  {
            text: 'Готово',
            callback_data: JSON.stringify({
                t: 'r',
                c:category,
                d:ids
            })
        }
        return key
    },
    bottle(query){
        query.cup = 'but'
        query.t = 'sub'
        return{
            text:'Бутылка',
            callback_data: JSON.stringify(query)

        }
    },
    cup(query){
        query.cup = 'cup'
        query.t = 'sub'
        return{
            text:'Стакан',
            callback_data: JSON.stringify(query)

        }
    },
    just_yes(query){
        query.cup = 'cup'
        query.t = 'sub'
        return{
            text:'Да',
            callback_data: JSON.stringify(query)
        }
    }
    // back_to_some_category(unit) {
    //     return {
    //         text: 'Назад 🔙',
    //         callback_data: JSON.stringify({
    //             t: 'unit',
    //             unit: unit
    //         })
    //     }
    // },
    // back_to_some_unit(unit) {
    //     return {
    //         text: 'Назад 🔙',
    //         callback_data: JSON.stringify({
    //             t: 'back_to_some_category',
    //             unit: unit
    //         })
    //     }
    // },
    // plus10(unit,isWater){
    //     return {
    //         text: '+10',
    //         callback_data: JSON.stringify({
    //             t: 'plus10',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // plus(unit,isWater){
    //     return {
    //         text: '+',
    //         callback_data: JSON.stringify({
    //             t: 'plus',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // minus(unit,isWater){
    //     return {
    //         text: '-',
    //         callback_data: JSON.stringify({
    //             t: 'minus',
    //             unit:  unit,
    //             isw: isWater
    //         })
    //     }
    // },
    // count(unit,c){
    //     return {
    //         text: c,
    //         callback_data: ' '
    //     }
    // },
    // del(unit){
    //     return {
    //         text: '🗑',
    //         callback_data: JSON.stringify({
    //             t: 'del',
    //             unit:  unit
    //         })
    //     }
    // }

}


