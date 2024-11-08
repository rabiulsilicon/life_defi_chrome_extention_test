import { ethers } from "ethers";
export const INFURA_PROJECT_ID = "23f0379b815d43d79597f5dcc134d608";
export const ETH_TESTNET = "sepolia";
export const CRYPTO_NETWORK = "mainnet";

export const providerURLs = {
  erc20: {
    mainnet: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    testnet: `https://${ETH_TESTNET}.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  bep20: {
    mainnet: "https://bsc-dataseed.binance.org",
    testnet: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  fantom_erc20: {
    mainnet: "https://rpc.ankr.com/fantom",
    testnet: "https://rpc.ankr.com/fantom_testnet",
  },
  polygon_erc20: {
    mainnet: "https://rpc.ankr.com/polygon",
    testnet: "https://rpc-amoy.polygon.technology",
  },
  avalanche_erc20: {
    mainnet: "https://api.avax.network/ext/bc/C/rpc",
    testnet: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  arbitrum_erc20: {
    mainnet: "https://arb1.arbitrum.io/rpc",
    testnet: "https://sepolia-rollup.arbitrum.io/rpc",
  },
  cronos_erc20: {
    mainnet: "https://cronos-evm.publicnode.com",
    testnet: "https://evm-t3.cronos.org",
  },
  optimism_erc20: {
    mainnet: "https://mainnet.optimism.io",
    testnet: "https://sepolia.optimism.io",
  },
  energi_erc20: {
    mainnet: "https://nodeapi.energi.network",
    testnet: "https://nodeapi.test.energi.network",
  },
  bitcoin: {
    mainnet: "https://api.blockcypher.com/v1/btc/main/addrs",
    testnet: "https://api.blockcypher.com/v1/btc/test3/addrs",
  },
  trc20: {
    mainnet: "https://api.trongrid.io",
    testnet: "https://api.nileex.io",
  },
};

export const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
];

const getConnection = (tokenType = "erc20", forceTestnet = false) => {
  const connection = new ethers.providers.JsonRpcProvider(
    providerURLs[tokenType][forceTestnet ? "testnet" : CRYPTO_NETWORK]
  );
  return connection;
};

export const fetchTokenInfo = async (
  contractAddress,
  tokenType = "erc20",
  userAddress
) => {
  const connection = getConnection(tokenType, false);
  const erc20 = new ethers.Contract(contractAddress, abi, connection);

  const [decimals, symbol, name, balance] = await Promise.all([
    erc20.decimals(),
    erc20.symbol(),
    erc20.name(),
    erc20.balanceOf(userAddress),
  ]);

  const balanceValue = ethers.utils.formatUnits(balance, decimals);

  return { decimals, symbol, name, balance: balanceValue };
};
