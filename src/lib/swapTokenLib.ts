import { ethers } from "ethers";

export const ONE_INCH_API_SECRET = "c9XPccRwDALjWHe8IqkB8r8wxlCHTDGe";

export const isJSON = (data) => {
  try {
    var json = JSON.parse(JSON.stringify(data));
    return typeof json === "object";
  } catch (e) {
    return false;
  }
};

export const sortAlpha = (items, sortedByKey) => {
  return [...items].sort((a, b) => {
    const nameA = a[sortedByKey]?.toUpperCase(); // ignore upper and lowercase
    const nameB = b[sortedByKey]?.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // equal
    return 0;
  });
};

export const walletBalanceFormatter = (balance, decimals) => {
  return ethers.utils.formatUnits(balance, decimals);
};
