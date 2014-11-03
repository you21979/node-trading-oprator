var TradingOperator = require('..');
var config = {
    'etwings1' : {
        exchange : 'etwings',
        apikey : '',
        secret : ''
    },
    'btcbox1' : {
        exchange : 'btcbox',
        apikey : '',
        secret : ''
    }
}
TradingOperator.load('..', config).then(function(){
    var wallet = TradingOperator.managers['wallet'];
    wallet.lookup('etwings1').depth('btc_jpy').then(console.log)
    wallet.lookup('btcbox1').depth('btc_jpy').then(console.log)
})
