import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function CryptoPurchasePrice({account,getTransactionHistory}) {
    const [amount, setAmount] = useState(0);
    const [payable_amount, setPayableAmount] = useState(0);
    
    useEffect(() => {
        async function getPrice() {
          if(amount > 0) {
            let data = await window.life.quikipay.getCryptoPayablePrice({
                crypto_amount: amount,
                token_address: "0xEf7A4Dd703D074974b7240C74b5ce938aA8983d3",
                crypto_network: "bnb",
                is_native: false,
            });
            setPayableAmount(data.payable_amount);
          }
        }
        if(account) {
            getPrice();
        }
    }, [amount,account]);

    async function onPurchase(e) {
        e.preventDefault();
        try {
          let data = await window.life.quikipay.requestCrytoPurchase({
            payable_currency: "USD",
            payable_amount: payable_amount,
            customer_name: e.target.customer_name.value,
            customer_email: e.target.customer_email.value,
            crypto_amount: amount,
            crypto_currency: "BLAZE",
            crypto_network: "BNB",
            crypto_wallet: account,
            order_id: Date.now().toString(),
            });
          console.log("🚀 ~ onPurchase ~ data:", data)
        } catch (error) {
            console.log("🚀 ~ onPurchase ~ error:", error)
        }
    }


    let error = null;
    if(payable_amount<5) {
      error = "Payable amount must be greater than 5 USD";
    }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Crypto Purchase Price</CardTitle>
        <CardDescription>
          Enter the details below to purchase BLAZE
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-4' onSubmit={onPurchase}>
          <div className='grid gap-2'>
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input type="text" id='customer_name' name='customer_name' placeholder='Customer Name' defaultValue={'John Doe'}/>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="customer_email">Customer Email</Label>
            <Input type="text" id='customer_email' name='customer_email' placeholder='Customer Email' defaultValue={'john.doe@example.com'}/>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="amount">Enter BLAZE Amount</Label>
            <Input type="number" id='amount' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <p className='text-sm'>Payable Amount: {payable_amount} USD</p>
          {error && <p className='text-sm text-red-500'>{error}</p>}
          <Button disabled={error} type='submit' className="w-full">Purchase</Button>
        </form>
      </CardContent>
    </Card>
  )
}
