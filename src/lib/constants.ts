import { IS_TESTNET, ETH_TESTNET } from "../../config";
export const SATOSHI = 100000000;

export const nonEvmStorageKeys = {
  btc: "btc_wallet_address",
  trx: "tron_wallet_address",
  trc20: "tron_wallet_address",
};
export const nonEvmCoins = ["btc", "trx"];
export const nativeCoins = [
  "eth",
  "bnb",
  "ftm",
  "matic",
  "avax",
  "arbitrum_eth",
  "cro",
  "optimism_eth",
  "nrg",
  "btc",
  "trx",
];

export const tokenTypes = [
  "erc20",
  "bep20",
  "fantom_erc20",
  "polygon_erc20",
  "avalanche_erc20",
  "arbitrum_erc20",
  "cronos_erc20",
  "optimism_erc20",
  "energi_erc20",
  "trc20",
];

export const currencyMapping = {
  eth: "erc20",
  bnb: "bep20",
  ftm: "fantom_erc20",
  matic: "polygon_erc20",
  avax: "avalanche_erc20",
  arbitrum_eth: "arbitrum_erc20",
  cro: "cronos_erc20",
  optimism_eth: "optimism_erc20",
  nrg: "energi_erc20",
  btc: "bitcoin",
  trx: "trc20",
};

// token type split on "_"
// used in: send screens(send, contact send)
export const transferTokenTypeMapping = {
  fantom: "fantom_erc20",
  polygon: "polygon_erc20",
  avalanche: "avalanche_erc20",
  arbitrum: "arbitrum_erc20",
  cronos: "cronos_erc20",
  optimism: "optimism_erc20",
  energi: "energi_erc20",
};

// used in: Token details, send screen: Token Name (Token Type)
export const customTokenTypeLabelMapping = {
  fantom_erc20: "FTM",
  polygon_erc20: "Polygon",
  avalanche_erc20: "Avalanche",
  arbitrum_erc20: "Arbitrum",
  arbitrum_eth: "ETH Network",
  cronos_erc20: "Cronos",
  optimism_eth: "ETH Network",
  optimism_erc20: "Optimism",
  energi_erc20: "Energi",
};

// used in: transaction list: token symbol mapping for long symbols
export const customTokenSymbolMapping = {
  ARBITRUM_ETH: "ARB - ETH Network",
  OPTIMISM_ETH: "OPT - ETH Network",
};

// used in: transaction list: token symbol mapping for long symbols
export const customTokenSymbolMappingTrx = {
  ARBITRUM_ETH: "ARB - ETH",
  OPTIMISM_ETH: "OPT - ETH",
};

// token type to [Network name, Network Currency] mapping
// used in Tx details & Send screen for displaying network currency symbol
export const networkMapping = {
  erc20: ["Ethereum", "ETH"],
  eth: ["Ethereum", "ETH"],
  bep20: ["Binance", "BNB"],
  bnb: ["Binance", "BNB"],
  ftm: ["Fantom", "FTM"],
  fantom_erc20: ["Fantom", "FTM"],
  matic: ["Polygon", "MATIC"],
  polygon_erc20: ["Polygon", "MATIC"],
  avax: ["Avalanche", "AVAX"],
  avalanche_erc20: ["Avalanche", "AVAX"],
  arbitrum_eth: ["Arbitrum", "Arbitrum ETH"],
  arbitrum_erc20: ["Arbitrum", "Arbitrum ETH"],
  cro: ["Cronos", "CRO"],
  cronos_erc20: ["Cronos", "CRO"],
  optimism_eth: ["Optimism", "Optimism ETH"],
  optimism_erc20: ["Optimism", "Optimism ETH"],
  nrg: ["Energi", "NRG"],
  energi_erc20: ["Energi", "NRG"],
  btc: ["Bitcoin", "BTC"],
  trx: ["Tron", "TRX"],
  trc20: ["Tron", "TRX"],
};

// used in transaction details
export const explorerUrlMapping = {
  ETH: `https://${IS_TESTNET ? ETH_TESTNET + "." : ""}etherscan.io/tx/`,
  BNB: `https://${IS_TESTNET ? "testnet." : ""}bscscan.com/tx/`,
  FTM: `https://${IS_TESTNET ? "testnet." : ""}ftmscan.com/tx/`,
  MATIC: `https://${IS_TESTNET ? "amoy." : ""}polygonscan.com/tx/`,
  AVAX: `https://${IS_TESTNET ? "testnet." : ""}snowtrace.io/tx/`,
  "Arbitrum ETH": `https://${IS_TESTNET ? "sepolia." : ""}arbiscan.io/tx/`,
  CRO: `https://${IS_TESTNET ? "testnet." : ""}cronoscan.com/tx/`,
  "Optimism ETH": IS_TESTNET
    ? "https://sepolia-optimism.etherscan.io/tx/"
    : "https://optimistic.etherscan.io/tx/",
  NRG: IS_TESTNET
    ? "https://explorer.test.energi.network/tx/"
    : "https://explorer.energi.network/tx/",
  BTC: IS_TESTNET
    ? "https://blockstream.info/testnet/tx/"
    : "https://blockstream.info/tx/",
  TRX: IS_TESTNET
    ? "https://nile.tronscan.org/#/transaction/"
    : "https://tronscan.org/#/transaction/",
};

// axios header config

export const requestHeaderConfig = {
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
};

export const usdDisabledTokens = {
  polygon: ["0x3daAa9bED3C4F84d5469971AB328C25691B0202d"],
};
