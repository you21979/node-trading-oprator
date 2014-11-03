var Promise = require('bluebird');
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


