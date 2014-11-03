var TradingOperator = require('..');
var Promise = require('bluebird');
var fs = require('fs');
var walletConfig = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));

TradingOperator.load('..', walletConfig).then(function(){
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
})
