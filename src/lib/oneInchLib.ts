import axios from "axios";
import * as yup from "yup";

export const initialValues = {
  swapNetwork: "",
  fromSwapToken: "",
  fromSwapAmount: 0,
  toSwapToken: "",
  toSwapAmount: 0,
  usdPriceRatio: null,
  sellTokenUsdPrice: null,
  buyTokenUsdPrice: null,
  sellMax: null,
  buyMax: null,
  sellTokenDecimals: null,
  buyTokenDecimals: null,
  slippage: 1,
  swapNetworkUsdPrice: 0,
  platformChage: null,
};

export const validationSchema = yup.object({
  swapNetwork: yup.string().required("Required"),
  fromSwapToken: yup.string().required("Required"),
  toSwapToken: yup.string().required("Required"),
  fromSwapAmount: yup
    .number()
    .typeError("Must be a number")
    .required("Required")
    .moreThan(0, "Invalid amount"),
  toSwapAmount: yup
    .number()
    .typeError("Must be a number")
    .required("Required")
    .moreThan(0, "Invalid amount"),
  sellTokenUsdPrice: yup.number().typeError("Coin not found"),
  buyTokenUsdPrice: yup.number().typeError("Coin not found"),
  slippage: yup.number().min(0).max(50),
});

export const getselectedTokenInfo = (tokenList, tokenAddress) => {
  return tokenList.find((swapToken) => swapToken?.address == tokenAddress);
};

export const checkIsToken = (tokenInfo) => {
  let isToken = false;
  if (Array.isArray(tokenInfo?.tags)) {
    isToken = tokenInfo?.tags?.includes("tokens");
  }
  return isToken;
};

export const tokenAlreadyExists = (tokens, tokenAddress, tokenType) => {
  const isExists = !!tokens?.find((token) => {
    return (
      token?.tokenAddress == tokenAddress && tokenType === token?.tokenType
    );
  });

  return isExists;
};

export const fetachTokensBalances = async (chainId, userAddress) => {
  let tokenBalances = `https://balances.1inch.io/v1.1/${chainId}/allowancesAndBalances/0x1111111254eeb25477b68fb85ed929f73a960582/${userAddress}?tokensFetchType=listedTokens`;
  const res = await axios.get(tokenBalances);
  return res?.data;
};

export const handleNetworkSwitchState = (setFieldValue) => {
  setFieldValue("fromSwapToken", "");
  setFieldValue("fromSwapAmount", 0);
  setFieldValue("toSwapToken", "");
  setFieldValue("toSwapAmount", 0);
  setFieldValue("usdPriceRatio", null);
  setFieldValue("buyTokenUsdPrice", null);
  setFieldValue("sellTokenUsdPrice", null);
  setFieldValue("sellMax", null);
  setFieldValue("buyMax", null);
  setFieldValue("sellTokenName", null);
  setFieldValue("buyTokenName", null);
  setFieldValue("sellTokenSymbol", null);
  setFieldValue("buyTokenSymbol", null);
  setFieldValue("sellTokenDecimals", null);
  setFieldValue("buyTokenDecimals", null);
  setFieldValue("platformChage", null);
};

export const handleSwitchTokenState = (setFieldValue, oldState) => {
  setFieldValue("buyMax", oldState.sellMax);
  setFieldValue("buyTokenDecimals", oldState.sellTokenDecimals);
  setFieldValue("buyTokenName", oldState.sellTokenName);
  setFieldValue("buyTokenSymbol", oldState.sellTokenSymbol);
  setFieldValue("buyTokenUsdPrice", oldState.sellTokenUsdPrice);
  setFieldValue("toSwapToken", oldState.fromSwapToken);
  setFieldValue("sellMax", oldState.buyMax);
  setFieldValue("sellTokenDecimals", oldState.buyTokenDecimals);
  setFieldValue("sellTokenName", oldState.buyTokenName);
  setFieldValue("sellTokenSymbol", oldState.buyTokenSymbol);
  setFieldValue("sellTokenUsdPrice", oldState.buyTokenUsdPrice);
  setFieldValue("fromSwapAmount", oldState.toSwapAmount);
  setFieldValue("fromSwapToken", oldState.toSwapToken);
};
