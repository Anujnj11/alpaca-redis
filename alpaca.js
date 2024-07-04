// const WebSocket = require('ws');

// const API_KEY_ID = 'AKB3TN9PPXZC2F1PIAD6';
// const API_SECRET_KEY = 'nmsgmIEHiLxhSqmdyQX6CTPmKquiGPL8ydJntTDb';

// const WEBSOCKET_URL = 'wss://stream.data.alpaca.markets/v2/iex';

// const ws = new WebSocket(WEBSOCKET_URL, {
//     headers: {
//         'APCA-API-KEY-ID': API_KEY_ID,
//         'APCA-API-SECRET-KEY': API_SECRET_KEY,
//     },
// });

// ws.on('open', () => {
//     console.log('WebSocket connection established');

//     const authMessage = {
//         action: 'auth',
//         key: API_KEY_ID,
//         secret: API_SECRET_KEY,
//     };
//     ws.send(JSON.stringify(authMessage));
// });

// ws.on('message', (data) => {
//     let message = JSON.parse(data);
//     console.log('Received message:', message);
//     message = message.pop();
//     if (message.T === 'success' && message.msg === 'authenticated') {
//         console.log('Authentication successful');

//         const subscribeMessage = {
//             action: 'subscribe',
//             trades: ['AAPL'], // Symbols for trades
//             quotes: ['AAPL'], // Symbols for quotes
//             bars: ["*"]
//             // news: ['*'], // Wildcard to subscribe to all news
//         };
//         ws.send(JSON.stringify(subscribeMessage));
//     } else if (message.T === 'success' && message.msg === 'connected') {
//         console.log('Connected to the WebSocket stream');
//     } else if (message.T === 'error' && message.msg === 'already authenticated') {
//         const subscribeMessage = {
//             action: 'unsubscribe',
//             trades: ['AAPL'], // Symbols for trades
//             quotes: ['AAPL'], // Symbols for quotes
//             bars: ["*"]
//             // news: ['*'], // Wildcard to subscribe to all news
//         };
//         ws.send(JSON.stringify(subscribeMessage));
//         console.log('Received data:', message);
//     } else {
//         console.log('Received data else:', message);
//     }
// });

// ws.on('error', (error) => {
//     console.error('WebSocket error:', error);
// });

// ws.on('close', (code, reason) => {
//     console.log(`WebSocket connection closed with code ${code} and reason ${reason}`);
// });


const Alpaca = require('@alpacahq/alpaca-trade-api')
const redis = require('./redis');
const alpaca = new Alpaca({
    keyId: '',
    secretKey: '',
    paper: true,
})


const websocket = alpaca.data_stream_v2;
websocket.onConnect(() => {
    websocket.subscribeForBars(["AAPL"]);
    // websocket.subscribeForUpdatedBars(["AAPL"]);
    // websocket.subscribeForQuotes(["AAPL"])
    // websocket.subscribeForTrades(["AAPL"]);
});

websocket.onStateChange((status) => {
    console.log("Status:", status);
});


websocket.onError((err) => {
    console.log("Error:", err);
});

// websocket.onStockTrade((trade) => {
//     console.log("Trade:", trade);
// });

// websocket.onStockQuote((trade) => {
//     console.log("Quote:", trade);
// });
websocket.onStockBar((trade) => {
    console.log("StockBar:", trade);
    console.log(new Date(trade?.Timestamp));
    redis.addStockData(trade)
});
// websocket.onStockUpdatedBar((trade) => {
//     console.log("StockUpdatedBar:", trade);
// });

websocket.connect();
