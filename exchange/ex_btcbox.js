var Promise = require('bluebird');
var moment = require('moment');
var btcbox = require('btcbox');
exports.isPlugin = true;
exports.name = function(){ return 'btcbox'; }
var cls = exports.cls = function(apikey, secretkey, agent){
    this.public = btcbox.PublicApi;
    this.private = btcbox.createPrivateApi(apikey, secretkey, agent);
}

cls.prototype.supportAssets = function(){
    return Promise.resolve(['btc','ltc','doge'].map(function(v){return [v, 'jpy'].join('_')}));
}

cls.prototype.depth = function(pair){
    return this.public.depth(pair).then(function(results){
        return {
            'asks' : results.asks.reverse(),
            'bids' : results.bids,
        };
    });
}

cls.prototype.balance = function(){
    return this.private.balance().then(function(result){
        return Object.keys(result).
            filter(function(v){return v.match(/_balance/)}).
            reduce(function(r, v){
                r[v.replace('_balance', '')] = result[v]
                return r;
            }, {})
    })
}

cls.prototype.tradeBuy = function(pair, price, amount){
    return this.private.tradeAdd(pair, amount, price, 'buy').then(function(result){
        return {
        }
    })
}

cls.prototype.tradeSell = function(pair, price, amount){
    return this.private.tradeAdd(pair, amount, price, 'sell').then(function(result){
        return {
        }
    })
}

cls.prototype.tradePosition = function(pair){
    return this.private.tradeList(pair, {since:0,type:'open'}).then(function(results){
        return getTradePosition(
            pair,
            results
        );
    })
}
cls.prototype.tradePositionAll = function(){
    return this.supportAssets().then(function(pairs){
        return Promise.all(pairs.map(function(pair){
            return this.private.tradeList(pair, {since:0,type:'open'}).then(function(results){
                return getTradePosition(
                    pair,
                    results
                );
            })
        })).then(function(results){
            return results.reduce(function(r,v){
                r.buy.concat(v.buy);
                r.sell.concat(v.sell);
                return r;
            }, {buy:[],sell:[]});
        })
    })
}

var getTradePosition = function(pair, results){
    return results.map(function(v){
        return {
            type : v.type,
            data : {
                id : v.id,
                pair : pair,
                price : v.price,
                amount : v.amount_original - v.amount_outstanding,
                time : moment(v.datetime, 'YYYY-MM-DD HH:mm:ss').unix(),
            }
        }
    }).
    reduce(function(r, v){
        r[v.type].push(v.data)
        return r;
    },{buy:[],sell:[]});
}

