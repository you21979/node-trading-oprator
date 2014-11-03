var Promise = require('bluebird');
var loadPlugins = require('./loadplugins');

var ExchangeManager = module.exports = function(){
    this.plugins = {};
}
ExchangeManager.prototype.load = function(path){
    var self = this;
    return loadPlugins(path).then(function(plugins){
        self.plugins = plugins.
            reduce(function(r, v){
                r[v.name()] = v;
                return r;
            }, {});
    })
}
ExchangeManager.prototype.lookup = function(name){
    return this.plugins[name];
}

