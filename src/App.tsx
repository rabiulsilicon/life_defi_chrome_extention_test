import CryptoPurchasePrice from "./components/story_fire/CryptoPurchasePrice";
import { Button } from "./components/ui/button";
import React, { useState, useEffect } from "react";

function App() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  console.log("🚀 ~ App ~ transactionHistory:", transactionHistory)



  const connectWallet = async () => {
    try {
      const data = await window.life.connect();
      setAccount(data.data.address);
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.life.disConnect();
      setAccount(null);
    } catch (error) {
      console.error("Disconnection failed", error);
    }
  };

  const getAddress = async () => {
    try {
      const data = await window.life.getAddress();
      setAccount(data.address);
    } catch (error) {
      console.error("Failed to get address", error);
    }
  };
  async function getTransactionHistory() {
    if(account) {
      const data = await window.life.quikipay.getCryptoPurchaseHistory(account);
      console.log("🚀 ~ getTransactionHistory ~ data:", data)
      setTransactionHistory(data);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getAddress();
    }, 1000);
  }, [window.life]);

  const sendTransaction = async (toAddress, amount, tokenAddress = null) => {
    try {
      const data = await window.life.send({
        amount,
        fromAddress: account,
        toAddress,
        tokenAddress,
      });
      console.log("Transaction data", data);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  useEffect(() => {
    window.addEventListener("NetworkSwitchEvent", (event) => {
      console.log("NetworkSwitchEvent:", event?.detail);
      setNetwork(event?.detail?.data);
    });

    return () => {
      window.removeEventListener("NetworkSwitchEvent", (event) => {
        console.log("NetworkSwitchEvent:", event?.detail);
        setNetwork(event?.detail?.data);
      });
    };
  }, []);

  useEffect(() => {
   
    if(account) {
      getTransactionHistory();
    }
  }, [account]);


//   {
//     "id": 8,
//     "order_id": "1729513093327",
//     "from_txid": "683697",
//     "from_currency": "USD",
//     "paid_amount": 49.98,
//     "to_txid": null,
//     "to_currency": "USDC",
//     "to_address": "0x15331fe7E3638c6EDD5833286C7fDCEb3506d46c",
//     "to_amount": 50,
//     "payment_status": "COMPLETED",
//     "status": 3,
//     "description": null,
//     "created_at": 1729513138000,
//     "updated_at": 1729513140000
//   }


  const retryTransaction = async (id) => {
    try {
      const data = await window.life.quikipay.retryTransaction(id);
      console.log("🚀 ~ retryTransaction ~ data:", data)
    } catch (error) {
      console.error("Retry transaction failed", error);
    }
  }

  return (
    <div className="h-screen w-full max-w-4xl mx-auto">
      <header className="flex justify-between items-center border-b pb-4 px-4 mt-4 shadow-sm">
        <h1>Life Extension Test</h1>
        {!account ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <>
            <p>Connected as: {account}</p>
            <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
          </>
        )}
      </header>
        <div className="mt-5">
          <CryptoPurchasePrice account={account} getTransactionHistory={getTransactionHistory} />
        </div>
        <div className="mt-5 space-y-4">
          <h3 className="text-slate-500 text-lg font-medium">Transaction History</h3>
          {transactionHistory && transactionHistory?.length>0 && [...transactionHistory].sort((a,b) => b.created_at - a.created_at).map((item, index)=>(
            <div key={index} className="p-4 border rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{item.order_id}</p>
                  <p className="text-gray-600">{item.from_currency} {item.paid_amount} → {item.to_currency} {item.to_amount}</p>
                  <p className="text-sm text-gray-500">Order Id: {item.order_id}</p>
                  <p className="text-sm text-gray-500">txid: {item.to_txid}</p>
                  <p className="text-sm text-gray-500">Time: {new Date(item.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${item.payment_status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {item.payment_status}
                  </p>
                  {
                    item.payment_status !== 'COMPLETED' && (
                      <Button onClick={()=>retryTransaction(item.id)}>Retry</Button>
                    )
                  }
                </div>
                
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

export default App;




