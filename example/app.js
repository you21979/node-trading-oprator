var TradingOperator = require('..');
var fs = require('fs');
var walletConfig = fs.readFileSync('./wallet.json', 'utf8');

TradingOperator.load('..', walletConfig).then(function(){
    var wallet = TradingOperator.managers['wallet'];
    wallet.lookup('etwings1').supportAssets().then(console.log)
    wallet.lookup('btcbox1').supportAssets().then(console.log)

    wallet.lookup('etwings1').depth('btc_jpy').then(console.log)
    wallet.lookup('btcbox1').depth('btc_jpy').then(console.log)
})
