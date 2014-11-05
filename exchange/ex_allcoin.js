var Promise = require('bluebird');
var allcoin = require('allcoin');
exports.isPlugin = true;
exports.name = function(){ return 'allcoin'; }
var cls = exports.cls = function(apikey, secretkey, agent){
    this.public = allcoin.PublicApi;
    this.private = allcoin.createPrivateApi(apikey, secretkey, agent);
}

cls.prototype.supportAssets = function(){
    return this.public.pairs().then(function(v){
        return Object.keys(v).map(function(key){ return key })
    })
}

cls.prototype.depth = function(pair){
    return this.public.depth(pair).then(function(v){
        return {
            asks : Object.keys(v.sell).map(function(key){
                return [parseFloat(key), v.sell[key]];
            }),
            bids : Object.keys(v.buy).map(function(key){
                return [parseFloat(key), v.buy[key]];
            }),
        }
    })
}

cls.prototype.balance = function(){
    return this.private.getInfo().then(function(result){
        return Object.keys(result.balances_available).
            reduce(function(r, key){
                r[key.toLowerCase()] = parseFloat(result.balances_available[key]);
                return r;
            },{});
    })
}

cls.prototype.tradeBuy = function(pair, price, amount){
    var w = pair.split('_');
    return this.private.buyCoin(w[1], amount, price, w[0]).then(function(result){
        return {
            id : result.order_id,
//            remain : result.remains,
//            balance : result.funds,
        }
    })
}

cls.prototype.tradeSell = function(pair, price, amount){
    return this.private.sellCoin(w[1], amount, price, w[0]).then(function(result){
        return {
            id : result.order_id,
//            remain : result.remains,
//            balance : result.funds,
        }
    })
}

cls.prototype.tradeCancel = function(orderid){
    return this.private.cancelOrder(orderid).then(function(result){
        return {
            id : result.order_id,
//            balance : result.funds,
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

