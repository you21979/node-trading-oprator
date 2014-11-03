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
