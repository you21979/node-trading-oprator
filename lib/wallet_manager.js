var Promise = require('bluebird');

var WalletManager = module.exports = function(){
    this.wallets = {};
}
WalletManager.prototype.init = function(em, config){
    var self = this;
    Object.keys(config).forEach(function(key){
        var myconfig = config[key];
        var m = em.lookup(myconfig.exchange);
        if(!m){
            throw new Error('fail exchange:' + key);
        }
        self.wallets[key] = new m.cls(myconfig.apikey, myconfig.secret, 'agent');
    });
}
WalletManager.prototype.lookup = function(name){
    return this.wallets[name];
}


