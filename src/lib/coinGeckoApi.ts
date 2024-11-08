import axios from "axios";
import { nativeCoins, requestHeaderConfig, tokenTypes } from "./constants";
export const COINGECKO_API_KEY = "CG-4DoW8cmEDuHMsLpLPAP2V3g6";

// cg pro api url
//https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=YOUR_API_KEY
export const CG_ROOT_URL = "https://pro-api.coingecko.com/api/v3";
const API_KEY_PARAM = `x_cg_pro_api_key=${COINGECKO_API_KEY}`;

// coingecko coin id
const coinIdMapping = {
  eth: "ethereum",
  bnb: "binancecoin",
  ftm: "fantom",
  matic: "matic-network",
  avax: "avalanche-2",
  arbitrum_eth: "ethereum", // arbitrum price/market data is same as eth
  cro: "crypto-com-chain",
  optimism_eth: "ethereum", // optimism price/market data is same as eth
  nrg: "energi",
  btc: "bitcoin",
  trx: "tron",
};

// coingecko asset platform id for tokens
const tokenTypeMapping = {
  erc20: "ethereum",
  bep20: "binance-smart-chain",
  fantom_erc20: "fantom",
  polygon_erc20: "polygon-pos",
  avalanche_erc20: "avalanche",
  arbitrum_erc20: "arbitrum-one",
  cronos_erc20: "cronos",
  optimism_erc20: "optimistic-ethereum",
  energi_erc20: "energi",
  trc20: "tron",
};

export const fetchCoinMarketPrice = async (coin = "eth") => {
  const coinId = coinIdMapping[coin];
  const URL = `${CG_ROOT_URL}/coins/${coinId}?${API_KEY_PARAM}&localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  let resData = {};

  try {
    const res = await axios.get(URL);
    if (res.data) {
      resData = res.data;
    }
  } catch (e) {
    console.log(e);
  }
  return resData;
};

export const fetchTokenMarketPrice = async (
  tokenType = "erc20",
  contractAddress = ""
) => {
  const platformId = tokenTypeMapping[tokenType];
  const URL = `${CG_ROOT_URL}/coins/${platformId}/contract/${contractAddress.toLowerCase()}?${API_KEY_PARAM}`;

  let resData = {};

  try {
    const res = await axios.get(URL);
    if (res.data) {
      resData = res.data;
    }
  } catch (e) {
    console.log(e);
  }
  return resData;
};

export const fetchCryptoPriceChart = async (
  tokenType = "erc20",
  contractAddress = "",
  days = 1
) => {
  let URL = "";

  if (tokenTypes.includes(tokenType)) {
    const platformId = tokenTypeMapping[tokenType];
    URL = `${CG_ROOT_URL}/coins/${platformId}/contract/${contractAddress.toLowerCase()}/market_chart/?vs_currency=usd&days=${days}&${API_KEY_PARAM}`;
  } else if (nativeCoins.includes(tokenType)) {
    const coinId = coinIdMapping[tokenType];
    URL = `${CG_ROOT_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&${API_KEY_PARAM}`;
  }

  let resData = {};

  if (!URL) {
    console.warn("Invalid url @fetchCryptoPriceChart");
    return resData;
  }

  try {
    const res = await axios.get(URL, requestHeaderConfig);
    if (res.data) {
      resData = res.data;
    }
  } catch (e) {
    console.log(e);
  }
  return resData;
};
