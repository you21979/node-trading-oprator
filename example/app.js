var TradingOperator = require('..');
var Promise = require('bluebird');
var fs = require('fs');
var walletConfig = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));

TradingOperator.load('..', walletConfig).then(function(){
/*
    var wallet = TradingOperator.managers['wallet'];
    return Promise.all([
        wallet.lookup('etwings1').supportAssets().then(console.log),
        wallet.lookup('btcbox1').supportAssets().then(console.log),
        wallet.lookup('etwings1').depth('btc_jpy').then(console.log),
        wallet.lookup('btcbox1').depth('btc_jpy').then(console.log)
    ])
}).then(function(){
    var wallet = TradingOperator.managers['wallet'];
    return Promise.all([
        wallet.lookup('etwings1').balance().then(console.log),
        wallet.lookup('btcbox1').balance().then(console.log)
    ])
}).then(function(){
    var wallet = TradingOperator.managers['wallet'];
    return Promise.all([
        wallet.lookup('etwings1').tradePosition('btc_jpy').then(console.log),
        wallet.lookup('btcbox1').tradePosition('btc_jpy').then(console.log)
    ]);
}).then(function(){
*/
    var wallet = TradingOperator.managers['wallet'];
    wallet.lookup('btcbox1').tradePosition('doge_jpy').then(function(r){
        console.log(r)
    });
/*
    var wallet = TradingOperator.managers['wallet'];
    wallet.lookup('btcbox1').tradeBuy('doge_jpy', 0.018, 1).then(console.log).then(function(){
        return wallet.lookup('btcbox1').tradePosition('doge_jpy').then(function(r){
            return Promise.all(r.buy.map(function(v){
                return wallet.lookup('btcbox1').tradeCancel('doge_jpy', v.id).then(console.log)
            }));
        })
    })
*/
/*
    var wallet = TradingOperator.managers['wallet'];
    wallet.lookup('etwings1').tradeBuy('mona_jpy', 3, 1).then(console.log).then(function(){
        return wallet.lookup('etwings1').tradePosition('mona_jpy').then(function(r){
            return Promise.all(r.buy.map(function(v){
                return wallet.lookup('etwings1').tradeCancel(v.id).then(console.log)
            }));
        })
    })
*/
})
