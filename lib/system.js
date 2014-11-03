var Promise = require('bluebird');
var ExchangeManager  = require('./exchange_manager');
var WalletManager  = require('./wallet_manager');

var System = function(){
    this.managers = {};
}
System.prototype.load = function(basepath, wallet_config){

    var em = this.managers['exchange'] = new ExchangeManager();
    var wm = this.managers['wallet'] = new WalletManager();

    var initialize = [
        function(){
            return em.load([basepath, 'exchange'].join('/')).then(function(){
                wm.init(em, wallet_config);
            })
        }
    ];
    return Promise.all(initialize.map(function(v){return v()}));
}

var system = module.exports = new System();

