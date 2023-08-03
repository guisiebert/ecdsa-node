import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
// import * as keccak from 'ethereum-cryptography/keccak' // not a function error
import {keccak256} from "ethereum-cryptography/keccak"
import utils from 'ethereum-cryptography/utils'
import {toHex} from 'ethereum-cryptography/utils'
import { useState } from "react";


export function CheckWallet({balance, setBalance }) {
  const [address, setAddress] = useState("")


  async function onPrivChange(evt) {    
    const input = evt.target.value;
    if (input.length != 64) {
      setPrivateKey(input);
      setFoundAddress("Invalid Private Key")
    } else {
        setPrivateKey(input);
        const publicKey = secp.getPublicKey(input)
        const publicAddress = toHex(keccak256(publicKey.slice(1)).slice(-20))
        setFoundAddress(publicAddress)
        fetchBalance(publicAddress)

        console.log(address)
        
    }
  }

  async function onAddressChange(evt) {
    const input = evt.target.value;
    fetchBalance(input)
  } 

  async function fetchBalance(address) {
    setAddress(address)

    if (address) {
      const addressData = await server.get(`balance/${address}`);
      console.log(addressData)

      const { data: { balance },} = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }


    return (
    <div className="container wallet">
      <h1>Check a Wallet</h1>

      <label>
        Address
        <input placeholder="Type in a private key" value={privateKey} onChange={onPrivChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}
