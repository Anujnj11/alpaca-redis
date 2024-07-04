const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
let connected = false;

client.on('connect', function () {
    console.log('Connected to Redis');
});

client.on('error', function (err) {
    console.error('Redis error:', err);
});

// (async () => {

//     await client.connect();
//     console.log("connected");

// });

// Function to add stock data
async function addStockData(stockData) {
    try {
        if (!connected) {
            await client.connect();
            connected = true;
        }
        const { Symbol, Timestamp } = stockData;
        const key = `stock:${Symbol}`;
        // To handle duplicate timestamps, use a unique identifier
        const member = JSON.stringify({ ...stockData, id: Date.now() + Math.random() });
        await client.zAdd(key, { score: new Date(Timestamp).getTime(), value: member });
        console.log("Added")
    } catch (error) {
        console.log(error)
    }
}

// Function to fetch stock data by index
async function getStockDataByIndex(symbol, index) {
    const key = `stock:${symbol}`;
    // Fetch the specific element by index
    const data = await client.zRange(key, index, index, 'REV');
    return data.length ? JSON.parse(data[0]) : null;
}

// Example usage
// (async () => {
//     const stockData1 = {
//         T: 'b',
//         Symbol: 'AAPL',
//         OpenPrice: 211.19,
//         HighPrice: 211.485,
//         LowPrice: 210.84,
//         ClosePrice: 210.97,
//         Volume: 31235,
//         Timestamp: '2024-06-28T19:58:00.000Z',
//         TradeCount: 288,
//         VWAP: 211.059685
//     };

//     const stockData2 = {
//         T: 'b',
//         Symbol: 'AAPL',
//         OpenPrice: 212.19,
//         HighPrice: 212.485,
//         LowPrice: 211.84,
//         ClosePrice: 211.97,
//         Volume: 32235,
//         Timestamp: '2024-06-28T20:00:00.000Z',
//         TradeCount: 300,
//         VWAP: 212.059685
//     };

//     await client.connect();
//     console.log("connected");

//     await addStockData(stockData1);
//     await addStockData(stockData2);

//     console.log("Added data")

//     const latestData = await getStockDataByIndex('AAPL', 0);
//     console.log('Latest data (Open(0)):', latestData);

//     const secondLatestData = await getStockDataByIndex('AAPL', 1);
//     console.log('Second latest data (Open(1)):', secondLatestData);

//     client.quit();
// })();

module.exports = {
    addStockData
};
