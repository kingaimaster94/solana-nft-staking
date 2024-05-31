import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import Contract from './Contract';
import axios from "axios";
require('dotenv').config();

//get .env params
const RpcHttpUrl = process.env.REACT_APP_RPC_HTTP_URL;
const ReceiverAddress = process.env.REACT_APP_RECEIVER_ADDRESS;
const SolanaAPI = process.env.REACT_APP_SOLANA_API;
const AuthAPI = process.env.REACT_APP_AUTH_API;
const SolanaRPCURL = process.env.REACT_APP_SOLANA_EXPLORER_RPC;

//create web3 connection
const web3Eth = new Web3(new Web3.providers.HttpProvider(RpcHttpUrl));

function Main(props) {
    //set params
    const [transferAmount, setTransferAmount] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [hideButton, setHideButton] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [splTokenBalance, setSplTokenBalance] = useState("");
    const [showError, setShowError] = useState(false);
    
    var signer;
    
    useEffect(() => {        
    }, [])
    try {        
        if (typeof window !== 'undefined') {
            if (window.ethereum) {
                window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);                
                signer = provider.getSigner();
                if (signer.provider.provider.selectedAddress) {                    
                    provider.getBalance(signer.provider.provider.selectedAddress).then((balance) => {                       
                        setIsWalletConnected(true);
                        const balanceInEth = ethers.utils.formatEther(balance);
                        console.log(`balance: ${balanceInEth} ETH`);                                                
                        (async()=>{
                            let solanaExplorerRPC = SolanaRPCURL;//process.env.SOLANA_EXPLORER_RPC;            
                            console.log("solanaExplorerRPC: ", solanaExplorerRPC);
                            let payload = {"method":"getMultipleAccounts","jsonrpc":"2.0",
                            "params":[[process.env.REACT_APP_SOLANA_TOKEN],
                            {"encoding":"jsonParsed","commitment":"confirmed"}],
                            "id":"a7f4cf4d-35c5-43cf-b47c-a4a6bbdd2332"};
                            let signature = await axios.post(solanaExplorerRPC, payload);
                            setSplTokenBalance(signature.data.result.value[0].data.parsed.info.tokenAmount.uiAmountString);
                            console.log("result: ", signature.data.result.value[0].data.parsed.info.tokenAmount.uiAmountString);
                        })();
                    });
                }
            }
            else {
                console.log("Error")
            }            
        }
    } catch (error) {
        console.log("getAccount ~ error", error)
}

const connectWalletHandler = () => {
    if (typeof window !== undefined) {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log("MetaMask Here!");
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    //accountChangedHandler(result[0]);
                    console.log("🚀 ~ file: Navbar.js ~ line 24 ~ .then ~ result[0]", result[0])
                    setIsWalletConnected(true);
                    //setConnButtonText("Connected");
                    //getAccountBalance(result[0]);
                })
                .catch((error) => {
                    //setErrorMessage(error.message);
                });
        } else {
            console.log("Need to install MetaMask");
            //setErrorMessage("Please install MetaMask browser extension to interact");
        }
    }
};

async function transfer(){
    //console.log("ReceiverAddress: ", ReceiverAddress);
    setShowError(false);
    console.log("Transferring the tokens...");
    if(Number(transferAmount) > Number(splTokenBalance)){
        setShowError(true);
        throw new Error("Don't have enough amount in pool account!");
    }
    console.log("Transaction is valid");
    const value = web3Eth.utils.toWei(transferAmount.toString(), 'Ether');
    const hash = await Contract.transfer(ReceiverAddress,value);
    setHideButton(true);
    console.log("hash: ", hash);  
    console.log("receiverAddress: ", receiverAddress);  
    console.log('Authorization: ', 'Bearer '+localStorage.getItem("token").replaceAll('"', ''));
    fetch(AuthAPI+"/setBridgeInfo", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem("token").replaceAll('"', '')
        },
        body: JSON.stringify({
            solanaAddress:receiverAddress != '' ? receiverAddress : localStorage.getItem("wallet"),
            evmAddress:signer.provider.provider.selectedAddress,
            amount:transferAmount,
        })
    });
    await fetch(SolanaAPI, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem("token").replaceAll('"', '')
        },
        body: JSON.stringify({
            address:receiverAddress != '' ? receiverAddress : localStorage.getItem("wallet"),
            evmAddress:signer.provider.provider.selectedAddress,
            amount:transferAmount,
        })
    });
    setShowResults(true);
    console.log("Transferred successfully!");
    setTimeout(
        function() {
            setHideButton(false);
            setShowResults(false);
        }
        .bind(this),
        10000
    );
}
    return (
        <div>
            <br />
            <div style={{ fontSize: "30px", "fontFamily":"impact" }}>
                Welcome to the O5O Token Bridge
            </div>
            <div style={{ fontSize: "16px" }}>
                Here you will be able to cross bridge your $O5O token to SOL {
                !isWalletConnected && ( 
                    <button onClick={connectWalletHandler}><img
                    class='mt-1'
                    src='/metamask_icon.svg'
                    style={{"width":"40px", height:"30px"}} />
                    </button>
                )}
            </div>            
            <br/>
            <div style={{fontSize:"16px", "paddingBottom":"10px", "fontFamily":"impact"}}>
                AVAILABLE $O5O SOLANA SPL TOKENS TO BRIDGE:
            </div>
            <div>
                <input
                    type="text"                   
                    disabled 
                    style={{height:"1.5vw",background:"lightgray"}}
                    value = {splTokenBalance}
                    placeholder="000...."
                />
            </div>
            <br/>
            <div style={{fontSize:"16px", "paddingBottom":"10px", "fontFamily":"impact"}}>
            Your Solana Wallet to receive $O5O:
            </div>
            <div>
                <input
                    type="text"                    
                    style={{height:"1.5vw"}}
                    value = {localStorage.getItem("wallet")}
                    onChange={(event) =>
                        setReceiverAddress(event.target.value)
                    }
                    placeholder="0x0000....."
                />
            </div>
            <br />
            <div style={{ fontSize: "16px", "paddingBottom":"10px", "fontFamily":"impact" }}>
                Total of your $O5O Tokens to bridge from Binance Smart Chain to Solana:
            </div>
            <div>
                <input
                    type="text"
                    style={{ height: "1.5vw"}}
                    onChange={(event) =>
                        setTransferAmount(event.target.value)
                    }
                    placeholder="000...."
                /> $O5O
            </div>
            <br />
            <div>
            {!hideButton && (
                    <div>
                        <button 
                            type="submit"
                            style={{width:"440px"}}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            onClick={() => transfer()}
                        >Bridge</button>
                    </div>)
                }
                {hideButton && !showResults && (
                    <div>
                    <img src="/loading.gif" style={{width:"50px"}}/> 
                    Processing your request, please do not refresh the page.
                    </div>                    
                    )
                }
                {showResults && (
                    
                    <div style={{color: "green", "fontSize": "16px"}}>
                        Tokens transferred successfully!!!
                    </div>)
                }
                {showError && (
                    
                    <div style={{color: "red", "fontSize": "16px"}}>
                        Don't have enough amount in pool account!
                    </div>)
                }
         </div>
        </div>
    );
}

export default Main;