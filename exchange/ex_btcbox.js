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

cls.prototype.tradePosition = function(pair){
    return this.private.tradeList({since:0,type:'open'}).then(function(results){
        return getTradePosition(
            results.filter(function(v){return true}) // フィルターかけようがない
        );
    })
}
cls.prototype.tradePositionAll = function(){
    return this.private.tradeList({since:0,type:'open'}).then(function(results){
        return getTradePosition(
            results
        );
    })
}

var getTradePosition = function(results){
    return results.map(function(v){
        return {
            type : v.type,
            data : {
                id : v.id,
                pair : 'btc_jpy', // ToDo:ペアがないんだけどw
                price : v.price,
                amount : v.amount_original - v.amount_outstanding,
                time : moment(v.datetime, 'YYYY-MM-DD HH:mm:ss').unix(),
            }
        }
    }).
    reduce(function(r, v){
        r[v.action].push(v.data)
        return r;
    },{buy:[],sell:[]});
}

