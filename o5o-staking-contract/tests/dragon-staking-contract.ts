import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import fs from 'fs';
import { DragonStaking } from "../target/types/dragon_staking";
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import { Commitment, ConnectionConfig } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import DEV_KEY from '/root/.config/solana/id.json';
const DEV_ENV = {
  CLUSTER_API: 'https://api.devnet.solana.com',
  REWARD_TOKEN: 'HMNGJyiuqEKny6grmcJwbNLmBn3WYcH3rgmWjwSph7ks',
  ADMIN: DEV_KEY
};

const ENV = DEV_ENV;
const GLOBAL_AUTHORITY_SEED = "global-authority";
const USER_POOL_DATA_SEED = "user-pool-data";
const USER_POOL_SEED = 'user-pool';
const { PublicKey, Keypair, Connection, SystemProgram } = anchor.web3;
const filepath = 'target/idl/dragon_staking.json';
const idlStr = fs.readFileSync(filepath);
const idl = JSON.parse(idlStr.toString());
// const envProvider = anchor.Provider.env();


describe("dragon-staking-contract", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.Provider.env();
  anchor.setProvider(provider);
  //const program = anchor.workspace.DaddyStakingContract as Program<DaddyStakingContract>;
  const program = new anchor.Program(idl, idl.metadata.address, provider) as Program<DragonStaking>;

  it("Is initialized!", async () => {
    // Add your test here.
    const seed = Uint8Array.from(ENV.ADMIN.slice(0, 32));
    const UPDATE_AUTHORITY = Keypair.fromSeed(seed);
    const connection = new Connection(ENV.CLUSTER_API, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig);
    let [vaultPDA, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );

    // await provider.connection.confirmTransaction(
    //   await provider.connection.requestAirdrop(provider.wallet.publicKey, 9000000000),
    //   "confirmed"
    // );
    console.log(program.programId.toString(), 'pID')
    // const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    //   [Buffer.from(anchor.utils.bytes.utf8.encode('global-authority-1'))],
    //   program.programId
    // );

    const tx = await program.rpc.initialize(
      {
        accounts: {
          globalAuthority: vaultPDA,
          owner: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        }
      });

    console.log("Your transaction signature", tx);

    const rewardAta = await getOrCreateAssociatedTokenAccount(
      connection,
      UPDATE_AUTHORITY,
      new PublicKey(ENV.REWARD_TOKEN),
      vaultPDA,
      true
    );
    console.log('rewardAta', rewardAta.address.toBase58());

  });



  // it("init user pool!", async () => {
  //   let [userPool] = await PublicKey.findProgramAddress(
  //     [Buffer.from(USER_POOL_SEED), provider.wallet.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const tx = await program.rpc.initUserPool({
  //     accounts: {
  //       owner: provider.wallet.publicKey,
  //       userPool: userPool,
  //       systemProgram: anchor.web3.SystemProgram.programId
  //     }
  //   });
  //   console.log("Your transaction signature", tx);
  // });

  // it("stake nft", async () => {
  //   const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode('global-authority-1'))],
  //     program.programId
  //   );

  //   const randKey = anchor.web3.Keypair.generate();
  //   const sourceNftAccount = anchor.web3.Keypair.generate();
  //   const destNftAccount = anchor.web3.Keypair.generate();
  //   const nftMint = anchor.web3.Keypair.generate();

  //   let [userPool, userBump] = await PublicKey.findProgramAddress(
  //     [randKey.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const tx = await program.rpc.stakeNft(globalBump, 0, {
  //     accounts: {
  //       owner: provider.wallet.publicKey,
  //       userPool: userPool,
  //       globalAuthority: globalAuthority,
  //       nftMint: nftMint.publicKey,
  //       sourceNftAccount: sourceNftAccount.publicKey,
  //       destNftAccount: destNftAccount.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       systemProgram: SystemProgram.programId,
  //     }
  //   });
  // });


  // it("unstake nft", async () => {
  //   const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode('global-authority-1'))],
  //     program.programId
  //   );

  //   const randKey = anchor.web3.Keypair.generate();
  //   const sourceNftAccount = anchor.web3.Keypair.generate();
  //   const destNftAccount = anchor.web3.Keypair.generate();
  //   const nftMint = anchor.web3.Keypair.generate();

  //   let [userPool, userBump] = await PublicKey.findProgramAddress(
  //     [randKey.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const tx = await program.rpc.unstakeNft(globalBump, {
  //     accounts: {
  //       owner: provider.wallet.publicKey,
  //       userPool: userPool,
  //       globalAuthority: globalAuthority,
  //       nftMint: nftMint.publicKey,
  //       sourceNftAccount: sourceNftAccount.publicKey,
  //       destNftAccount: destNftAccount.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     }
  //   })
  // });

  // it("claim", async () => {
  //   const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode('global-authority-1'))],
  //     program.programId
  //   );

  //   const randKey = anchor.web3.Keypair.generate();
  //   const sourceRewardAccount = anchor.web3.Keypair.generate();
  //   const destRewardAccount = anchor.web3.Keypair.generate();
  //   const nftMint = anchor.web3.Keypair.generate();

  //   let [userPool, userBump] = await PublicKey.findProgramAddress(
  //     [randKey.publicKey.toBuffer()],
  //     program.programId
  //   );


  //   const tx = await program.rpc.claimReward(globalBump, {
  //     accounts: {
  //       owner: provider.wallet.publicKey,
  //       userPool: userPool,
  //       globalAuthority: globalAuthority,
  //       sourceAccount: sourceRewardAccount.publicKey,
  //       destAccount: destRewardAccount.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     }
  //   })

  // });

});
