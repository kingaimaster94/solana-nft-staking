const web3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const dotenv = require("dotenv");
dotenv.config();
const process = require("process");
const axios = require("axios");

const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors');
const { json } = require("body-parser");
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/transfer', async(req, res) => {
      console.log("req.header: ", req.headers["authorization"]);
      console.log("req.body.address: ", req.body.address);
      console.log("req.body.amount: ", req.body.amount);
      console.log("req.body.evmAddress: ", req.body.evmAddress);

      let data = {
        solanaAddress: req.body.address,
        evmAddress: req.body.evmAddress,
        amount: req.body.amount
      };
      axios.post(process.env.AUTH_API+"/setBridgeInfo",data,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers["authorization"]
        }                
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      //console.log("process.env.PAYER_ACCOUNT_SECRET: ", process.env.PAYER_ACCOUNT_SECRET);
      privateKey = atob(process.env.PAYER_ACCOUNT_SECRET);
      let accountPrivateKey = privateKey.split(",").map(Number);
      const secret = new Uint8Array(accountPrivateKey);
      //const DEMO_WALLET_SECRET_KEY = new Uint8Array([220,184,175,174,214,142,75,159,123,90,96,79,117,124,156,208,32,6,223,73,5,195,190,239,9,134,82,25,50,159,233,186,80,244,84,176,144,37,49,126,45,39,146,12,180,240,64,39,74,195,66,211,204,3,171,65,60,139,134,134,98,204,246,182]);
      console.log("process.env.ANCHOR_PROVIDER_URL: ", process.env.ENVIORNMENT);
      var connection = new web3.Connection(web3.clusterApiUrl(process.env.ENVIORNMENT));
      var fromWallet = web3.Keypair.fromSecretKey(secret);
      console.log("fromWallet: ", fromWallet.publicKey.toString());
      console.log("req.body.address: ", req.body.address);
      var toWallet = new web3.PublicKey(req.body.address);
      console.log("toWallet: ", toWallet);
      var myMint = new web3.PublicKey(process.env.MINT_TOKEN);
      var myToken = new splToken.Token(
          connection,
          myMint,
          splToken.TOKEN_PROGRAM_ID,
          fromWallet
      );
      var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
          fromWallet.publicKey
      );
      var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
          toWallet
      );
      var transactionSol = new web3.Transaction()
      .add(
          splToken.Token.createTransferInstruction(
              splToken.TOKEN_PROGRAM_ID,
              fromTokenAccount.address,
              toTokenAccount.address,
              fromWallet.publicKey,
              [],
              1000000000*Number(req.body.amount)
          )
      );
      var signature = await web3.sendAndConfirmTransaction(
          connection,
          transactionSol,
          [fromWallet]
        );
      console.log("SIGNATURE", signature);
      console.log("SUCCESS");
    return res.status(200).json({
        signature: signature,
    });
})

app.use('/', router)

module.exports = app;