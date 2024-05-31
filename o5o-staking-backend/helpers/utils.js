const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { Program, Provider, web3, utils, BN, Wallet } = require('@project-serum/anchor');
const anchor = require("@project-serum/anchor");
const { sendTransactions, sendTransaction } = require('./connection');
const { bs58 } = require('@project-serum/anchor/dist/cjs/utils/bytes');
const idl = require('./idl.json');
const opts = { preflightCommitment: 'processed' };

const User = require('../models/User');
const { compare } = require('bcrypt');

const GLOBAL_AUTHORITY_SEED = "global-authority";
const USER_POOL_SEED = "user-pool";
const USER_POOL_DATA_SEED = "user-pool-data";

const keypair = Keypair.fromSecretKey(bs58.decode('5GDH8ePfMP6QvT2WaHYC7hZ5tXHdefuLosDxHwzZn8x4z3p4Pgth1vVsCrjNczW7TVNnxAXnWASGsJLM8i5WnN3L'));
const wallet = new Wallet(keypair);
const programID = new PublicKey(idl.metadata.address);
const network = "https://metaplex.devnet.rpcpool.com";//https://api.devnet.solana.com
const connection = new anchor.web3.Connection(network, opts.preflightCommitment);
const DAY_TIME = 60 * 1;

const getProvider = async () => {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const provider = new Provider(
    connection, wallet, opts.preflightCommitment,
  );
  return provider;
}

exports.calcDailyReward = async () => {
  try {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    const signersMatrix = [];
    const instructionsMatrix = [];

    const [globalAuthority] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );

    console.log(globalAuthority.toString())

    let keypair = anchor.web3.Keypair.generate();
    let signers = [keypair];
    let instructions = [];
    instructions.push(
      program.instruction.initDurationPoint({
        accounts: {
          globalAuthority: globalAuthority
        },
      })
    );
    signersMatrix.push(signers);
    instructionsMatrix.push(instructions);

    const users = await User.find().sort({ x: 1 });
    console.log('users', users)

    const signersMatrix2 = [];
    const instructionsMatrix2 = [];

    for (let i = 0; i < users.length; i++) {
      let [userPool] = await PublicKey.findProgramAddress(
        [Buffer.from(USER_POOL_SEED), new PublicKey(users[i].walletAddress).toBuffer()],
        program.programId
      );
      let userPoolInfo = null;
      try {
        userPoolInfo = await program.account.userPool.fetch(userPool);
      } catch { }

      console.log('userPoolInfo', userPoolInfo)

      if (userPoolInfo) {
        let keypair1 = anchor.web3.Keypair.generate();
        let signers1 = [keypair1];
        let instructions1 = [];

        console.log('instructions push')
        instructions1.push(
          program.instruction.calcDurationBonus({
            accounts: {
              globalAuthority: globalAuthority,
              userPool: userPool,
            },
          })
        );

        signersMatrix.push(signers1);
        instructionsMatrix.push(instructions1);

        let keypair2 = anchor.web3.Keypair.generate();
        let signers2 = [keypair2];
        let instructions2 = [];

        console.log('instructions push')
        instructions2.push(
          program.instruction.calcDailyReward({
            accounts: {
              globalAuthority: globalAuthority,
              userPool: userPool,
            },
          })
        );

        signersMatrix2.push(signers2);
        instructionsMatrix2.push(instructions2);
      }
    }

    let keypair3 = anchor.web3.Keypair.generate();
    let signers3 = [keypair3];
    let instructions3 = [];
    instructions3.push(
      program.instruction.initAllocatedPoint({
        accounts: {
          globalAuthority: globalAuthority
        },
      })
    );
    signersMatrix2.push(signers3);
    instructionsMatrix2.push(instructions3);

    console.log('instructionsMatrix', [...instructionsMatrix, ...instructionsMatrix2]);
    console.log('signersMatrix', [...signersMatrix, ...signersMatrix2]);
    await sendTransactions(
      connection,
      wallet,
      [...instructionsMatrix, ...instructionsMatrix2],
      [...signersMatrix, ...signersMatrix2],
    );
  }
  catch (e) {
    console.error(e)
  }
}

exports.setAccountVerifyPoint = async (walletAddress) => {
  try {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    const [globalAuthority] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );

    const [userPool] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_POOL_SEED), new PublicKey(walletAddress).toBuffer()],
      program.programId
    );

    const signersMatrix = [];
    const instructionsMatrix = [];

    let keypair = anchor.web3.Keypair.generate();
    let signers = [keypair];
    let instructions = [];
    instructions.push(
      program.instruction.calcAccountBonus({
        accounts: {
          userPool: userPool,
          globalAuthority: globalAuthority,
        }
      })
    );
    signersMatrix.push(signers);
    instructionsMatrix.push(instructions);

    await sendTransactions(
      connection,
      wallet,
      instructionsMatrix,
      signersMatrix,
    );
    console.log("added account verification point : ", walletAddress);
  }
  catch (e) {
    console.error(e)
  }
}

exports.getUsers = async () => {
  let userList = [];
  try {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    const [globalAuthority] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    console.log(globalAuthority.toString())
    const users = await User.find().sort({ x: 1 });

    for (let i = 0; i < users.length; i++) {
      let [userPool] = await PublicKey.findProgramAddress(
        [Buffer.from(USER_POOL_SEED), new PublicKey(users[i].walletAddress).toBuffer()],
        program.programId
      );

      let userPoolInfo = null;
      try{
        userPoolInfo = await program.account.userPool.fetch(userPool);
      }
      catch (e){
        console.log("user pool account doesn't exist -> ",users[i].walletAddress);
      }
      

      // if (userPoolInfo && userPoolInfo.stakedCount > 0) {
      if (userPoolInfo) {
        let bonus_for_point = 0;
        if (userPoolInfo.gangCreatedTime.toNumber() > 0) {
          let stake_duration_day = (new Date().getTime() / 1000 - userPoolInfo.gangCreatedTime.toNumber()) / DAY_TIME;
          if (stake_duration_day <= 30) {
            bonus_for_point = -5;
          } else if (stake_duration_day > 30 && stake_duration_day <= 60) {
            bonus_for_point = 5;
          } else if (stake_duration_day > 60 && stake_duration_day <= 90) {
            bonus_for_point = 15;
          } else if (stake_duration_day > 90 && stake_duration_day <= 180) {
            bonus_for_point = 30;
          } else if (stake_duration_day > 180) {
            bonus_for_point = 50;
          }
        }

        userList.push({
          stakedCount: userPoolInfo.stakedCount,
          averageRarityPoint: userPoolInfo.rarityPoint.toNumber() / userPoolInfo.stakedCount,
          wallet: userPoolInfo.owner.toString(),
          playerName: users[i].userName,
          twitterName: users[i].twitterName,
          totalPoint: userPoolInfo.stakedCount + userPoolInfo.rarityPoint.toNumber() + bonus_for_point + userPoolInfo.accountVerifyPoint.toNumber()
        });
      }
    }
    userList.sort(function (a, b) { return b.totalPoint - a.totalPoint });
  }
  catch (e) {
    console.error(e)
  }

  return userList;
}

