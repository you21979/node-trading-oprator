var btcbox = require('btcbox');
exports.isPlugin = true;
exports.name = function(){ return 'btcbox'; }
var cls = exports.cls = function(apikey, secretkey, agent){
    this.public = btcbox.PublicApi;
    this.private = btcbox.createPrivateApi(apikey, secretkey, agent);
}

cls.prototype.depth = function(pair){
    return this.public.depth(pair).then(function(results){
        return {
            'asks' : results.asks.reverse(),
            'bids' : results.bids,
        };
    });
}
