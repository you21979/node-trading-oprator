var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var loadPlugins = module.exports = function(path, config){
    return fs.readdirAsync(path).then(function(results){
        return results.
            map(function(name){return require([path, name].join('/'))}).
            filter(function(m){ return m['isPlugin'] === true })
    })
}

