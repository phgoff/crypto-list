const axios = require('axios')
const fs = require('fs')

const BASE_URL = 'https://api1.binance.com/api/v3/ticker/24hr'
const BASE_VOL = 8 * 10**6 // Million

const getIgnorePair = (quote, pairs =[]) => {
    const result = pairs.map(p => `${p}${quote}`)
    return result
}

const getDate = () => {
    const today = new Date()
    return `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`
}

const getTradeList = async () => {
    const quote = 'USDT'
    const res = await axios.get(BASE_URL)
    const ignorePairs = getIgnorePair(quote, ['BUSD','UP', 'DOWN', 'EUR', 'AUD', 'JPY', 'GBP'])
    const resultPairs = res.data.filter(i => {
        return i.quoteVolume >  BASE_VOL &&
        i.symbol.endsWith(quote) &&
        i.symbol.includes(quote) &&
        !i.symbol.endsWith('UPUSDT') &&
        !ignorePairs.includes(i.symbol)
    })

    // sort volume DESC
    const sorted = resultPairs.sort((a,b) => b.quoteVolume - a.quoteVolume)

    const result = sorted.map(i => `BINANCE:${i.symbol}`).join(',')

    fs.writeFileSync(`./list-${getDate()}.txt`, JSON.stringify(result, null, 2))
    console.log('total pair: ', resultPairs.length);

}

getTradeList().then(() => {
    console.log('done')
})

