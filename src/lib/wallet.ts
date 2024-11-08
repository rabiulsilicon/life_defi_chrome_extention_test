import { CRYPTO_NETWORK, providerURLs } from "./token";
import { ethers } from "ethers";

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

export const getWalletBalance = async (currency = "eth", userAddress) => {
  // eth/bnb/ftm
  let roundedBalance = 0;
  try {
    const currencyType = currencyMapping[currency];
    if (!currencyType) {
      throw new Error("Invalid currency type @getWalletBalance");
    }
    const URL = providerURLs[currencyType][CRYPTO_NETWORK];
    const provider = new ethers.providers.JsonRpcProvider(URL);
    const balance = await provider.getBalance(userAddress);
    const formattedBalance = ethers.utils.formatEther(balance);

    roundedBalance = Math.round(formattedBalance * 1e4) / 1e4; // four digit rounding
  } catch (e) {
    console.log(`Fetch wallet balance error on currency ${currency}`, e);
  }
  return roundedBalance;
};
