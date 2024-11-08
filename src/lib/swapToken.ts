import { getUserAddress, getUserPrivateKey } from "./user";
import { providerURLs } from "./tokenInfo";
import {
  BACKEND_API_URL,
  BE_API_KEY,
  CLIENT_TYPE,
  CLIENT_VERSION,
  CRYPTO_NETWORK,
  SWAP_BROADCAST_API_BASE_URL,
} from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncStoreKeys } from "../constants/store";
import axios from "axios";
import md5 from "md5";

export const ONE_INCH_API_SECRET = "c9XPccRwDALjWHe8IqkB8r8wxlCHTDGe"
export const FEE_RATE = 0.01;
const SWAP_FEE_ADDRESS = "0xebBaeAC0aFa8214129eA49e11122B299cdc6aa4B";

export const swapNetworks = [
  { label: "Ethereum", value: "Ethereum" },
  { label: "BNB Chain", value: "BinanceSmartChain" },
  { label: "Polygon", value: "Polygon" },
  { label: "Arbitrum", value: "Arbitrum" },
  { label: "Avalanche", value: "Avalanche" },
  { label: "Fantom", value: "Fantom" },
];

export const swapTokenTypeMaping = {
  Ethereum: "erc20",
  BinanceSmartChain: "bep20",
  Polygon: "polygon_erc20",
  Arbitrum: "arbitrum_erc20",
  Avalanche: "avalanche",
  Fantom: "fantom_erc20",
};

export const swapCoinIdMapping = {
  Ethereum: "eth",
  BinanceSmartChain: "bnb",
  Polygon: "matic",
  Arbitrum: "arbitrum_eth",
  Avalanche: "avax",
  Fantom: "ftm",
};

export const swapRpcMaping = {
  Ethereum: "erc20",
  BinanceSmartChain: "bep20",
  Polygon: "polygon_erc20",
  Arbitrum: "arbitrum_erc20",
  Avalanche: "avalanche_erc20",
  Fantom: "fantom_erc20",
};

export const getSwapWalletBalance = async (networkType) => {
  // eth/bnb/ftm
  let roundedBalance = 0;
  try {
    const userAddress = await getUserAddress();
    const URL = providerURLs[networkType][CRYPTO_NETWORK];
    const { ethers }  =  require("ethers");
    const provider = new ethers.providers.JsonRpcProvider(URL);
    const balance = await provider.getBalance(userAddress);
    const formattedBalance = ethers.utils.formatEther(balance);

    roundedBalance = Math.round(formattedBalance * 1e4) / 1e4; // four digit rounding
  } catch (e) {
    console.log(e);
  }
  return roundedBalance;
};

export const getConvertedUnitAmount = (amount, decimals) => {
  try {
    const web3 = require("web3");
  // const web3 = new Web3(providerURLs.erc20.mainnet);
  let unit_amount =
    decimals == 18
      ? web3.utils.toWei(`${amount}`)
      : amount * parseInt("1".padEnd(decimals + 1, 0));

  return unit_amount;
  } catch (error) {
    console.log("Erroro on getConvertedUnitAmount", error)
  }
  
};

export const getSwapTokenGasFee = async (networkType, transaction) => {
  const URL = providerURLs[networkType][CRYPTO_NETWORK];
  const walletaddress = await getUserAddress();
  const { ethers }  =  require("ethers");
  const provider = new ethers.providers.JsonRpcProvider(URL);

  const gasPrice = await provider.getGasPrice();
  const estimatedGas = await provider.estimateGas({
    ...transaction,
    from: walletaddress,
  });

  const totalFee = gasPrice.mul(estimatedGas);
  const formattedFee = ethers.utils.formatUnits(totalFee);

  return {
    formattedFee,
    estimatedGas: estimatedGas.toString(),
    gasPrice: gasPrice.toString(),
  };
};

export const getSignSwapTransaction = async (networkType, transaction) => {
  const URL = providerURLs[networkType][CRYPTO_NETWORK];
  const walletPrivateKey = await getUserPrivateKey();
  const Web3 = require("web3");
  const web3 = new Web3(URL);
  const res = await web3.eth.accounts.signTransaction(
    transaction,
    walletPrivateKey
  );

  return res.rawTransaction;
};

export const broadCastRawTransaction = (chainId, rawTransaction) => {
  const broadcastApiUrl = SWAP_BROADCAST_API_BASE_URL + chainId + "/broadcast";
  return fetch(broadcastApiUrl, {
    method: "post",
    body: JSON.stringify({ rawTransaction }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      return res.transactionHash;
    });
};

export const getApproveTransaction = async (networkType, transactionHash) => {
  const URL = providerURLs[networkType][CRYPTO_NETWORK];
  // const walletaddress = await getUserAddress();
  const { ethers }  =  require("ethers");
  const provider = new ethers.providers.JsonRpcProvider(URL);

  const transaction = await provider.getTransaction(transactionHash);
  return transaction;
};

export const getSwapChargedGasFee = async (networkType, amount) => {
  const URL = providerURLs[networkType][CRYPTO_NETWORK];
  const { ethers }  =  require("ethers");
  const provider = new ethers.providers.JsonRpcProvider(URL);

  const gasPrice = await provider.getGasPrice();
  const estimatedGas = await provider.estimateGas({
    to: SWAP_FEE_ADDRESS,
    value: ethers.utils.parseEther(String(amount)),
  });

  const totalFee = gasPrice.mul(estimatedGas);
  const formattedFee = ethers.utils.formatUnits(totalFee);
  return { formattedFee, gasPrice, gasLimit: estimatedGas };
};

export const sendChargedFee = async (
  networkType,
  amount,
  gasPrice,
  gasLimit
) => {
  const URL = providerURLs[networkType][CRYPTO_NETWORK];
  const { ethers }  =  require("ethers");
  const provider = new ethers.providers.JsonRpcProvider(URL);
  const pKey = await getUserPrivateKey();
  const wallet = new ethers.Wallet(pKey);
  const signer = wallet.connect(provider);

  const txRequest = await signer.sendTransaction({
    to: SWAP_FEE_ADDRESS,
    value: ethers.utils.parseEther(String(amount)),
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  });

  const txConfirmed = await txRequest.wait();

  return txConfirmed;
};

export const saveFailedSwapChargedTransaction = async (
  network,
  currency,
  amount,
  swap_id
) => {
  const userAddress = await getUserAddress();
  let failedChargedTrxs = [];
  const failedChargedTrxsString = await AsyncStorage.getItem(
    asyncStoreKeys.failed_1inch_swap_trxs
  );
  if (failedChargedTrxsString !== null) {
    failedChargedTrxs = JSON.parse(failedChargedTrxsString);
  }

  failedChargedTrxs.push({
    address: userAddress,
    currency,
    network,
    swap_id,
    amount,
  });

  await AsyncStorage.setItem(
    asyncStoreKeys.failed_1inch_swap_trxs,
    JSON.stringify(failedChargedTrxs)
  );
};

export const getFailedSwapChargedTransactions = async () => {
  let failedChargedTrxs = [];
  const failedChargedTrxsString = await AsyncStorage.getItem(
    asyncStoreKeys.failed_1inch_swap_trxs
  );

  if (failedChargedTrxsString !== null) {
    failedChargedTrxs = JSON.parse(failedChargedTrxsString);
  }

  return failedChargedTrxs;
};

export const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(true);
    }, ms);
  });
};

export const getXRequestHash = async () => {
  let salt = new Date().valueOf();
  console.log("original salt", salt);
  const URL = `${BACKEND_API_URL}/get-server-status?client_type=${CLIENT_TYPE}&client_version=${CLIENT_VERSION}`;

  try {
    const res = await axios.get(URL);
    if (res.data?.result?.timestamp) {
      salt = res.data?.result?.timestamp;
      console.log("received salt from backend", salt);
    }
  } catch (e) {
    console.warn("error @getXRequestHash", e);
  }

  let hash = md5(BE_API_KEY + salt);
  let request_hash = salt + "." + hash;

  return request_hash;
};

export const addPendingSwapFee = async (
  swap_service,
  currency,
  fee_amount,
  swap_id,
  send_amount,
  status
) => {
  const userAddress = await getUserAddress();
  const URL = `${BACKEND_API_URL}/save-swap-log?client_type=${CLIENT_TYPE}&client_version=${CLIENT_VERSION}`;

  const reqBody = {
    swap_service,
    swap_id,
    address: userAddress,
    currency,
    fee_amount,
    send_amount,
    status,
  };

  const xreqHash = await getXRequestHash();

  const res = await axios.post(URL, reqBody, {
    headers: {
      "X-RequestHash": xreqHash,
    },
  });

  return res.data;
};

export const getPendingSwapFee = async () => {
  const userAddress = await getUserAddress();
  const URL = `${BACKEND_API_URL}/get-pending-fee-logs/${userAddress}?client_type=${CLIENT_TYPE}&client_version=${CLIENT_VERSION}`;
  const xreqHash = await getXRequestHash();
  const res = await axios.get(URL, {
    headers: {
      "X-RequestHash": xreqHash,
    },
  });
  return res.data;
};

export const resolvePendingSwapFee = async (swap_id) => {
  const URL = `${BACKEND_API_URL}/resolve-pending-fee?client_type=${CLIENT_TYPE}&client_version=${CLIENT_VERSION}`;

  const reqBody = {
    swap_id,
    status: 2,
  };

  const xreqHash = await getXRequestHash();

  const res = await axios.post(URL, reqBody, {
    headers: {
      "X-RequestHash": xreqHash,
    },
  });

  return res.data;
};

export const isJSON = (data) => {
  try {
    var json = JSON.parse(JSON.stringify(data));
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
};
