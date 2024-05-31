/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import useWalletBalance from "./use-wallet-balance";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import { programs } from "@metaplex/js";
import toast from "react-hot-toast";
import {
  Keypair,
  PublicKey,
  Transaction,
  ConfirmOptions,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import axios from "axios";
import {
  STAKE_DATA_SIZE,
  STAKE_CONTRACT_IDL,
  COLLECTION_NAME,
} from "../constant/contract";
import {
  GLOBAL_AUTHORITY_SEED,
  NEXT_PUBLIC_SOLANA_NETWORK,
  NEXT_PUBLIC_STAKE_CONTRACT_ID,
  REWARD_TOKEN,
  REWARD_TOKEN_DECIMALS,
  USER_POOL_DATA_SEED,
  USER_POOL_SEED,
} from "../constant/env";
import { printLog } from "../utils/utility";
import { sendTransactions } from "../helpers/sol/connection";

const {
  metadata: { Metadata },
} = programs;
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
// const connection = new anchor.web3.Connection(
//   NEXT_PUBLIC_SOLANA_NETWORK == "devnet"
//     ? "https://metaplex.devnet.rpcpool.com"
//     : "https://metaplex.mainnet.rpcpool.com"
// );

const connection = new anchor.web3.Connection(
  NEXT_PUBLIC_SOLANA_NETWORK == "devnet"
    ? "https://api.devnet.solana.com"
    : "https://metaplex.mainnet.rpcpool.com"
);


const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
const idl = STAKE_CONTRACT_IDL as anchor.Idl;
const confirmOption: ConfirmOptions = {
  commitment: "finalized",
  preflightCommitment: "finalized",
  skipPreflight: false,
};

const rewardMint = new PublicKey(REWARD_TOKEN);

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

const sendTransaction = async (
  transaction: Transaction,
  signers: Keypair[],
  wallet: AnchorWallet
) => {
  try {
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash("max")
    ).blockhash;
    await transaction.setSigners(
      wallet.publicKey,
      ...signers.map((s) => s.publicKey)
    );
    if (signers.length != 0) await transaction.partialSign(...signers);
    const signedTransaction = await wallet.signTransaction(transaction);
    let hash = await connection.sendRawTransaction(
      await signedTransaction.serialize()
    );
    await connection.confirmTransaction(hash);
    toast.success("Transaction succeed.");
  } catch (err) {
    toast.error("Transaction failed. Please try again.");
  }
};

const getTokenWallet = async (
  wallet: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
};

const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getStakedNftsForOwner = async (wallet: AnchorWallet) => {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  const allTokens: any = [];

  // let [globalAuthority] = await PublicKey.findProgramAddress(
  //     [Buffer.from(GLOBAL_AUTHORITY_SEED)],
  //     program.programId
  // );

  let stakedNftList = await connection.getParsedProgramAccounts(programId);
  for (let nftAccount of stakedNftList) {
    try {
      let stakedNft = await program.account.userPoolData.fetch(
        nftAccount.pubkey
      );
      console.log(nftAccount);

      if (stakedNft.owner.toString() !== wallet.publicKey.toString()) {
        continue;
      }

      let mint = stakedNft.nftMint;
      let pda = await getMetadata(mint);
      let account = await getTokenWallet(wallet.publicKey, mint);
      const accountInfo: any = await connection.getParsedAccountInfo(pda);
      let metadata: any = new Metadata(
        wallet.publicKey.toString(),
        accountInfo.value
      );
      // if (metadata.data.data.symbol == COLLECTION_NAME) {
        const { data }: any = await axios.get(metadata.data.data.uri);
        const entireData = {
          ...data,
          id: Number(data.name.replace(/^\D+/g, "").split(" - ")[0]),
        };
        allTokens.push({
          account: account,
          poolKey: nftAccount.pubkey,
          address: mint,
          ...entireData,
        });
      // }
    } catch (err) {
      console.log(err);
    }
  }
  return allTokens;
};

const getStakedNftsForOwner1 = async (wallet: AnchorWallet) => {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);

  const allTokens: any = [];
  try {
    let resp = await connection.getProgramAccounts(programId, {
      dataSlice: {
        length: 0,
        offset: 0,
      },
      filters: [
        {
          dataSize: STAKE_DATA_SIZE,
        },
        {
          memcmp: {
            offset: 8,
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ],
    });

    for (let nftAccount of resp) {
      let stakedNft = await program.account.userPool.fetch(nftAccount.pubkey);
      if (stakedNft.itemCount == 0) {
        continue;
      }

      for (let i = 0; i < stakedNft.itemCount; i++) {
        let mint = stakedNft.nftMintList[i];
        let pda = await getMetadata(mint);
        const accountInfo: any = await connection.getParsedAccountInfo(pda);
        let metadata: any = new Metadata(
          wallet.publicKey.toString(),
          accountInfo.value
        );
        const { data }: any = await axios.get(metadata.data.data.uri);
        const entireData = {
          ...data,
          id: Number(data.name.replace(/^\D+/g, "").split(" - ")[0]),
        };
        allTokens.push({
          poolKey: nftAccount.pubkey,
          address: mint,
          ...entireData,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
  return allTokens;
};

const getPoolInfo = async (wallet: AnchorWallet) => {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let userPoolInfo = null;
  // for (let stakeAccount of resp) {
  let [userPool] = await PublicKey.findProgramAddress(
    [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
    program.programId
  );
  try {
    userPoolInfo = await program.account.userPool.fetch(userPool);
  } catch { }
  return userPoolInfo;
};

const getGlobalInfo = async (wallet: AnchorWallet) => {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let globalInfo = null;
  // for (let stakeAccount of resp) {
  let [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  try {
    globalInfo = await program.account.globalPool.fetch(globalAuthority); //
  } catch (err) {
    console.log(err);
  }
  return globalInfo;
};

const _stakeNftList = async (
  wallet: AnchorWallet,
  stakeMode: any,
  nftMintList: any
) => {
  let provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  let program = new anchor.Program(idl, programId, provider);
  let [userPool] = await PublicKey.findProgramAddress(
    [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
    program.programId
  );
  // let transaction = new Transaction();
  // let signers: Keypair[] = [];

  try {
    const signersMatrix = [];
    const instructionsMatrix = [];

    let userPoolInfo = await getPoolInfo(wallet);
    let instructions: any[] = [];
    if (userPoolInfo == null) {
      instructions.push(
        await program.instruction.initUserPool({
          accounts: {
            owner: wallet.publicKey,
            userPool: userPool,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        })
      );
      let keypair = anchor.web3.Keypair.generate();
      let signers = [keypair];

      signersMatrix.push(signers);
      instructionsMatrix.push(instructions);
    }

    const [globalAuthority] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );

    for (let i = 0; i < nftMintList.length; i++) {
      let instructions: any[] = [];
      let nftMint = nftMintList[i];

      const sourceNftAccount = nftMint.account;
      const destNftAccount = await getTokenWallet(
        globalAuthority,
        nftMint.address
      );
      console.log(
        "mint-2",
        nftMint.address.toString(),
        "sourceNftAccount",
        sourceNftAccount.toString(),
        "destNftAccount",
        destNftAccount.toString()
      );

      if ((await connection.getAccountInfo(destNftAccount)) == null) {
        // transaction.add(createAssociatedTokenAccountInstruction(destNftAccount, wallet.publicKey, globalAuthority, nftMint.address))
        instructions.push(
          createAssociatedTokenAccountInstruction(
            destNftAccount,
            wallet.publicKey,
            globalAuthority,
            nftMint.address
          )
        );
      }

      let [userPoolData] = await PublicKey.findProgramAddress(
        [
          Buffer.from(USER_POOL_DATA_SEED),
          wallet.publicKey.toBuffer(),
          nftMint.address.toBuffer(),
        ],
        program.programId
      );

      instructions.push(
        await program.instruction.stakeNft(1,{
          accounts: {
            owner: wallet.publicKey,
            userPool: userPool,
            userPoolData: userPoolData,
            globalAuthority: globalAuthority,
            nftMint: nftMint.address,
            sourceNftAccount: sourceNftAccount,
            destNftAccount: destNftAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        })
      );

      // transaction.add(
      //     await program.instruction.stakeNft({
      //         accounts: {
      //             owner: wallet.publicKey,
      //             userPool: userPool,
      //             userPoolData: userPoolData,
      //             globalAuthority: globalAuthority,
      //             nftMint: nftMint.address,
      //             sourceNftAccount: sourceNftAccount,
      //             destNftAccount: destNftAccount,
      //             tokenProgram: TOKEN_PROGRAM_ID,
      //             systemProgram: anchor.web3.SystemProgram.programId,
      //         }
      //     })
      // );

      let keypair = anchor.web3.Keypair.generate();
      let signers = [keypair];

      signersMatrix.push(signers);
      instructionsMatrix.push(instructions);
    }

    await sendTransactions(
      connection,
      wallet,
      instructionsMatrix,
      signersMatrix
    );
    // await delay(20000);

    toast.success("Transaction succeed.");
    return 1;
  } catch (err) {
    toast.error("Transaction failed.");
    console.log(err);
    return 0;
  }
  // await sendTransaction(transaction, signers, wallet);
};

function delay(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const stake = async (
  PoolKey: PublicKey,
  nftMint: PublicKey,
  wallet: AnchorWallet
) => {
  let provider = new anchor.Provider(connection, wallet, confirmOption);
  let program = new anchor.Program(idl, programId, provider);

  const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  const sourceNftAccount = await getTokenWallet(wallet.publicKey, nftMint);
  const destNftAccount = await getTokenWallet(globalAuthority, nftMint);
  let transaction = new Transaction();
  let signers: Keypair[] = [];
  let [userPoolData] = await PublicKey.findProgramAddress(
    [
      Buffer.from(USER_POOL_DATA_SEED),
      wallet.publicKey.toBuffer(),
      nftMint.toBuffer(),
    ],
    program.programId
  );

  if ((await connection.getAccountInfo(destNftAccount)) == null)
    transaction.add(
      createAssociatedTokenAccountInstruction(
        destNftAccount,
        wallet.publicKey,
        globalAuthority,
        nftMint
      )
    );
  transaction.add(
    await program.instruction.stakeNft(1,{
      accounts: {
        owner: wallet.publicKey,
        userPool: PoolKey,
        userPoolData: userPoolData,
        globalAuthority: globalAuthority,
        nftMint: nftMint,
        sourceNftAccount: sourceNftAccount,
        destNftAccount: destNftAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    })
  );
  await sendTransaction(transaction, signers, wallet);
};

const unStake = async (nfts: any[], wallet: AnchorWallet) => {
  let provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  let program = new anchor.Program(idl, programId, provider);

  const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  let [userPool] = await PublicKey.findProgramAddress(
    [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
    program.programId
  );

  const signersMatrix = [];
  const instructionsMatrix = [];

  // let transaction = new Transaction();
  for (let i = 0; i < nfts.length; i++) {
    let instructions: any[] = [];
    let destAccount = await getTokenWallet(wallet.publicKey, nfts[i].address);
    let sourceAccount = await getTokenWallet(globalAuthority, nfts[i].address);

    console.log(
      "mint-1",
      nfts[i].address.toString(),
      "sourceNftAccount",
      sourceAccount.toString(),
      "destNftAccount",
      destAccount.toString()
    );

    if ((await connection.getAccountInfo(destAccount)) == null) {
      // transaction.add(createAssociatedTokenAccountInstruction(destAccount, wallet.publicKey, wallet.publicKey, nfts[i].address))
      instructions.push(
        createAssociatedTokenAccountInstruction(
          destAccount,
          wallet.publicKey,
          wallet.publicKey,
          nfts[i].address
        )
      );
    }

    let [userPoolData] = await PublicKey.findProgramAddress(
      [
        Buffer.from(USER_POOL_DATA_SEED),
        wallet.publicKey.toBuffer(),
        nfts[i].address.toBuffer(),
      ],
      program.programId
    );

    // transaction.add(
    //     await program.instruction.unstakeNft(globalBump, {
    //         accounts: {
    //             owner: wallet.publicKey,
    //             userPool: userPool,
    //             userPoolData: userPoolData,
    //             globalAuthority: globalAuthority,
    //             nftMint: nfts[i].address,
    //             sourceNftAccount: sourceAccount,
    //             destNftAccount: destAccount,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //         }
    //     })
    // );

    instructions.push(
      await program.instruction.unstakeNft(globalBump,1, {
        accounts: {
          owner: wallet.publicKey,
          userPool: userPool,
          userPoolData: userPoolData,
          globalAuthority: globalAuthority,
          nftMint: nfts[i].address,
          sourceNftAccount: sourceAccount,
          destNftAccount: destAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      })
    );
    let keypair = anchor.web3.Keypair.generate();
    let signers = [keypair];

    signersMatrix.push(signers);
    instructionsMatrix.push(instructions);
  }

  // await sendTransaction(transaction, [], wallet);
  try {
    await sendTransactions(
      connection,
      wallet,
      instructionsMatrix,
      signersMatrix
    );
    // await delay(20000);
    toast.success("Transaction succeed.");
    return 1;
  } catch (err) {
    toast.error("Transaction failed.");
    console.log(err);
    return 0;
  }
};

async function claim(wallet: AnchorWallet) {

  let provider = new anchor.Provider(connection, wallet, confirmOption);
  let program = new anchor.Program(idl, programId, provider)

  const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
  );

  var myToken = new Token(
      connection,
      rewardMint,
      TOKEN_PROGRAM_ID,
      wallet as any
  );
  let sourceRewardAccount = await getTokenWallet(globalAuthority, rewardMint);
  let srcAccInfo = await myToken.getAccountInfo(sourceRewardAccount);
  if (!srcAccInfo) {
      return;
  }

  let transaction = new Transaction();

  let destRewardAccount = await withFindOrInitAssociatedTokenAccount(
      transaction,
      provider.connection,
      rewardMint,
      wallet.publicKey,
      wallet.publicKey,
      true
  );

  let [userPool, userBump] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
      program.programId
  );

  transaction.add(
      await program.instruction.claimReward({
          accounts: {
              owner: wallet.publicKey,
              userPool: userPool,
              globalAuthority: globalAuthority,
              sourceAccount: sourceRewardAccount,
              destAccount: destRewardAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
          }
      })
  )
  try {
      await sendTransaction(transaction, [], wallet);
  } catch (err: any) {
      printLog(err.reason || err.error?.message || err.message)
  }
}

const useNftStake = () => {
  const [balance, setBalance] = useWalletBalance();
  const anchorWallet = useAnchorWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [stakedNfts, setStakedNfts] = useState<Array<any>>([]);
  // const [claimedAmount, setClaimedAmount] = useState(0);
  // const [dailyReward, setDailyReward] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [stakedCount, setStakedCount] = useState(0);
  const [totalStakedNFT, setTotalStakedNFT] = useState(0);
  const [rewardedTime, setRewardedTime] = useState(0);

  useEffect(() => {
    getStakedNfts();
  }, [anchorWallet, balance]);

  useEffect(() => {
    // const interval = setInterval(async () => {
    //   try {
    //     if (
    //       !anchorWallet ||
    //       !anchorWallet.publicKey ||
    //       !anchorWallet.signAllTransactions ||
    //       !anchorWallet.signTransaction
    //     ) {
    //       return;
    //     }
    //     let poolInfo = await getPoolInfo(anchorWallet);
    //     if (poolInfo != null) {
    //       // let days = 0;
    //       // if (Math.floor(Date.now() / 1000) > poolInfo.rewardTime.toNumber()) {
    //       //   days =
    //       //     (Math.floor(Date.now() / 1000) - poolInfo.rewardTime.toNumber()) /
    //       //     DAY_TIME;
    //       // }
    //       // let reward = poolInfo.claimable.toNumber() / LAMPORTS_PER_SOL + poolInfo.stakedCount * days;
    //       // setClaimAmount(Math.floor(reward * 100) / 100);
    //       setStakedCount(poolInfo.stakedCount);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }, 10000);
    // return () => clearInterval(interval);
  }, [anchorWallet]);

  const getStakedNfts = async () => {
    try {
      if (
        !anchorWallet ||
        !anchorWallet.publicKey ||
        !anchorWallet.signAllTransactions ||
        !anchorWallet.signTransaction
      ) {
        return;
      }

      setIsLoading(true);
      const stakedNftsForOwner = await getStakedNftsForOwner(anchorWallet);
      console.log("loaded staked nfts", stakedNftsForOwner);
      setStakedNfts(stakedNftsForOwner);
      let globalInfo = await getGlobalInfo(anchorWallet);
      console.log("globalInfo", globalInfo);
      setTotalStakedNFT(globalInfo?.stakedCount);
      const poolInfo = await getPoolInfo(anchorWallet);
      console.log("poolInfo", poolInfo);
      if (poolInfo != null) {
        // setClaimAmount(poolInfo.claimableReward.toNumber() / LAMPORTS_PER_SOL);
        // setDailyReward(get_daily_reward(poolInfo.stakedCount));
        console.log("claimableReward", poolInfo.claimableReward.toNumber() / REWARD_TOKEN_DECIMALS);
        console.log("durationPoint", poolInfo.durationPoint.toNumber());
        console.log("dailyReward", poolInfo.dailyReward.toNumber());     
        console.log("stakedCount", poolInfo.stakedCount);     
        console.log("gangCreatedTime", poolInfo.gangCreatedTime.toNumber(), new Date(poolInfo.gangCreatedTime.toNumber()).toUTCString());     
        setClaimAmount(Math.floor(poolInfo.claimableReward.toNumber() / REWARD_TOKEN_DECIMALS * 100) / 100);
        setStakedCount(poolInfo.stakedCount);
        // console.log("poolinfo->totalrewards", poolInfo?.totalReward.toNumber() / LAMPORTS_PER_SOL)
        setRewardedTime(poolInfo.rewardTime.toNumber());
      }
      setIsLoading(false);
    } catch (e){
      console.error(e)
      setIsLoading(false);
    }
  };

  const get_daily_reward_multiplier = (cnt: number) => {
    let res = 0.0;
    if (cnt == 1) {
      res = 1;
    } else if (cnt == 2) {
      res = 1.25;
    } else if (cnt == 4) {
      res = 1.5;
    } else if (cnt == 6) {
      res = 1.75;
    } else if (cnt == 8) {
      res = 2;
    }
    return res;
  };

  const get_daily_reward = (staked_count: number) => {
    let rest = staked_count % 8;
    let daily_reward = 0;
    if (rest % 2 == 0) {
      daily_reward =
        8.0 * 2.0 * 2.0 * Math.floor(staked_count / 8) +
        rest * 2.0 * get_daily_reward_multiplier(rest);
    } else {
      daily_reward =
        8.0 * 2.0 * 2.0 * Math.floor(staked_count / 8) +
        (rest - 1) * 2.0 * get_daily_reward_multiplier(rest - 1) +
        1.0 * 2.0 * 1.0;
    }
    // let days = (now - self.reward_time) / DAY_TIME;
    // self.total_reward = self.total_reward + daily_reward as u64 * days as u64 * DECIMAL;
    // self.reward_time = now;
    // Ok(self.total_reward)
    return daily_reward;
  };

  const updateBalance = async (wallet: AnchorWallet) => {
    const balance = await connection.getBalance(wallet.publicKey);
    setBalance(balance / LAMPORTS_PER_SOL);
  };

  const stakeNftList = async (stakeMode: any, nftMintList: any) => {
    if (!anchorWallet) {
      toast.error("Connect wallet first, please.");
      return 0;
    }
    setIsLoading(true);
    try {
      const res = await _stakeNftList(anchorWallet, stakeMode, nftMintList);
      // await updateBalance(anchorWallet);
      // if (res == 1) {
      //   const poolInfo = await getPoolInfo(anchorWallet);
      //   console.log("poolInfo", poolInfo);
      //   if (poolInfo != null) {
      //     // setClaimAmount(poolInfo.stakedCount);
      //     console.log(
      //       "poolInfo->totalReward",
      //       poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL
      //     );
      //     console.log("setClaimAmt3", poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL)  
      //     setClaimAmount(Math.floor(poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL * 100) / 100);
      //     setRewardedTime(poolInfo.rewardTime.toNumber());
      //   }
      // }
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      return 0;
    }
  };

  const stakeNft = async (PoolKey: PublicKey, nftMint: PublicKey) => {
    if (!anchorWallet) {
      toast.error("Connect wallet first, please.");
      return;
    }

    setIsLoading(true);

    await stake(PoolKey, nftMint, anchorWallet);
    // await updateBalance(anchorWallet);

    setIsLoading(false);
  };

  const unStakeNft = async (nfts: any[]) => {
    if (!anchorWallet) {
      toast.error("Connect wallet first, please.");
      return;
    }
    setIsLoading(true);
    const res = await unStake(nfts, anchorWallet);
    // if (res == 1) {
    //   const poolInfo = await getPoolInfo(anchorWallet);
    //   console.log("poolInfo", poolInfo);
    //   if (poolInfo != null) {
    //     console.log(
    //       "poolInfo->totalReward",
    //       poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL
    //     );
    //     console.log("setClaimAmt4", poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL)  
    //     setClaimAmount(Math.floor(poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL * 100) / 100);
    //     setRewardedTime(poolInfo.rewardTime.toNumber());
    //   }
    // }
    setIsLoading(false);
    return res;
  };

  const claimRewards = async () => {
    if (!anchorWallet) {
      toast.error("Connect wallet first, please.");
      return;
    }

    setIsLoading(true);
    await claim(anchorWallet);
    setIsLoading(false);
  };

  return {
    isLoading,
    stakedNfts,
    stakedCount,
    claimAmount,
    totalStakedNFT,
    stakeNftList,
    stakeNft,
    unStakeNft,
    claimRewards,
    getStakedNfts,
    setStakedNfts,
  };
};

async function withFindOrInitAssociatedTokenAccount(
  transaction: Transaction,
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  allowOwnerOffCurve: boolean
) {
  const associatedAddress = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    mint,
    owner,
    allowOwnerOffCurve
  );
  const account = await connection.getAccountInfo(associatedAddress);
  if (!account) {
    transaction.add(
      splToken.Token.createAssociatedTokenAccountInstruction(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        mint,
        associatedAddress,
        owner,
        payer
      )
    );
  }
  return associatedAddress;
}

export default useNftStake;
