const axios = require("axios");
const fs = require("fs");

// UPDATE THESE VARIABLE
const QUOTE = "BUSD";
const MIN_VOL_MILLION = 6;
//

const baseURL = "https://api1.binance.com/api/v3/ticker/24hr";
const baseVOL = 8 * 10 ** MIN_VOL_MILLION; // Million

const getDate = () => {
  const today = new Date();
  return `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
};

const getTradeList = async () => {
  const res = await axios.get(baseURL);
  const resultPairs = res.data.filter((i) => {
    return i.quoteVolume > baseVOL && i.symbol.endsWith(QUOTE);
  });

  // sort volume DESC
  const sorted = resultPairs.sort((a, b) => b.quoteVolume - a.quoteVolume);

  const result = sorted.map((i) => `BINANCE:${i.symbol}`).join(",");

  fs.writeFileSync(`./list-${getDate()}.txt`, result);
  console.log("total pair: ", resultPairs.length);
};

getTradeList().then(() => {
  console.log("done");
});
