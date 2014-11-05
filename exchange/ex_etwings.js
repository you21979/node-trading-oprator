var Promise = require('bluebird');
var etwings = require('etwings');
exports.isPlugin = true;
exports.name = function(){ return 'etwings'; }
var cls = exports.cls = function(apikey, secretkey, agent){
    this.public = etwings.PublicApi;
    this.private = etwings.createPrivateApi(apikey, secretkey, agent);
}

cls.prototype.supportAssets = function(){
    return Promise.resolve(['btc','mona'].map(function(v){return [v, 'jpy'].join('_')}));
}

cls.prototype.depth = function(pair){
    return this.public.depth(pair);
}

cls.prototype.balance = function(){
    return this.private.getInfo().then(function(result){
        return result.funds;
    })
}

cls.prototype.tradeBuy = function(pair, price, amount){
    return this.private.trade(pair, 'bid', price, amount).then(function(result){
        return {
            id : result.order_id,
            remain : result.remains,
            balance : result.funds,
        }
    })
}

cls.prototype.tradeSell = function(pair, price, amount){
    return this.private.trade(pair, 'ask', price, amount).then(function(result){
        return {
            id : result.order_id,
            remain : result.remains,
            balance : result.funds,
        }
    })
}

cls.prototype.tradeCancel = function(orderid){
    return this.private.cancelOrder(orderid).then(function(result){
        return {
            id : result.order_id,
            balance : result.funds,
        }
    })
}


cls.prototype.tradePosition = function(pair){
    return this.private.activeOrders().then(function(result){
        return getTradePosition(
            result,
            Object.keys(result).
                filter(function(key){return result[key].currency_pair === pair})
        );
    })
}

cls.prototype.tradePositionAll = function(){
    return this.private.activeOrders().then(function(result){
        return getTradePosition(
            result,
            Object.keys(result)
        );
    })
}

var getTradeDirectionFrom = function(type){
    var tbl = {
        'bid' : 'buy',
        'ask' : 'sell',
    }
    return tbl[type] ? tbl[type] : '';
}
var getTradeDirectionTo = function(type){
    var tbl = {
        'buy' : 'bid',
        'sell' : 'ask',
    }
    return tbl[type] ? tbl[type] : '';
}

var getTradePosition = function(result, keys){
    return keys.map(function(key){
        return {
            type : getTradeDirectionFrom(result[key].action),
            data : {
                id : key,
                pair : result[key].currency_pair,
                price : result[key].price,
                amount : result[key].amount,
                time : parseInt(result[key].timestamp),
            },
        }
    }).
    reduce(function(r, v){
        r[v.type].push(v.data)
        return r;
    },{buy:[],sell:[]});
}


