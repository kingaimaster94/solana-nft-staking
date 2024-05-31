/* eslint-disable array-callback-return */
/* eslint-disable no-lone-blocks */
import { web3 } from "@project-serum/anchor";
import { AnchorWallet, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BACKEND_URL, GLOBAL_AUTHORITY_SEED, NEXT_PUBLIC_SOLANA_NETWORK, NEXT_PUBLIC_STAKE_CONTRACT_ID, REWARD_TOKEN, USER_POOL_SEED } from '../constant/env';
import * as anchor from "@project-serum/anchor";
import { ConfirmOptions, Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { STAKE_CONTRACT_IDL } from "../constant/contract";
import { sendTransactions } from "../helpers/sol/connection";
import * as splToken from "@solana/spl-token";
import Loader from "../components/loader/Loader";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { REWARD_TOKEN_DECIMALS } from './../constant/env';
import Sidebar from "../components/views/Sidebar";
import Navbar from "../components/views/Navbar";


const Admin = () => {

	const rewardMint = new PublicKey(REWARD_TOKEN);

	const { wallet } = useWallet();

	const anchorWallet = useAnchorWallet();

	const solInputRef = useRef<HTMLInputElement>(null);

	const connection = new anchor.web3.Connection(
		NEXT_PUBLIC_SOLANA_NETWORK == "devnet"
			? "https://api.devnet.solana.com"
			: "https://metaplex.mainnet.rpcpool.com"
	);

	const [showLoader, setShowLoader] = useState(false);
	const [globalData, setGlobalData] = useState<any>();

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

	const getGlobalData = async (anchorWallet: AnchorWallet) => {
		const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
		const idl = STAKE_CONTRACT_IDL as anchor.Idl;

		const confirmOption: ConfirmOptions = {
			commitment: "finalized",
			preflightCommitment: "finalized",
			skipPreflight: false,
		};
		let provider = new anchor.Provider(connection, anchorWallet, confirmOption);
		let program = new anchor.Program(idl, programId, provider);

		const [globalAuthority] = await PublicKey.findProgramAddress(
			[Buffer.from(GLOBAL_AUTHORITY_SEED)],
			program.programId
		);

		console.log(globalAuthority.toString())

		const globalAuthorityInfo = await program.account.globalPool.fetch(globalAuthority);

		console.log("globalAuthorityInfo", globalAuthorityInfo)

		return globalAuthorityInfo;
	}

	useEffect(() => {
		try {
			if (anchorWallet) {
				setShowLoader(true);
				getGlobalData(anchorWallet).then((res) => {
					setGlobalData(res);
					setShowLoader(false);
				}).catch(() => {
					setShowLoader(false);
				})
			}
		} catch (error) {
			console.log(error);
		}
	}, [anchorWallet]);

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
			console.log('error', err)
			toast.error("Transaction failed. Please try again.");
		}
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

	const onAllocateReward = async () => {
		try {
			if (anchorWallet) {
				const signersMatrix: any[] = [];
				const instructionsMatrix: any[] = [];

				const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
				const idl = STAKE_CONTRACT_IDL as anchor.Idl;

				const confirmOption: ConfirmOptions = {
					commitment: "finalized",
					preflightCommitment: "finalized",
					skipPreflight: false,
				};
				let provider = new anchor.Provider(connection, anchorWallet, confirmOption);
				let program = new anchor.Program(idl, programId, provider);

				const [globalAuthority] = await PublicKey.findProgramAddress(
					[Buffer.from(GLOBAL_AUTHORITY_SEED)],
					program.programId
				);

				console.log(globalAuthority.toString())

				const globalAuthorityInfo = await program.account.globalPool.fetch(globalAuthority);

				console.log("globalAuthorityInfo", globalAuthorityInfo)
				// if (allocated_month == current_month && allocated_year == current_year) {
				// 	toast.error("You already allocate reward to users");
				// 	return
				// }

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

				const users = (await axios.get(`${BACKEND_URL}/user/getUsers`)).data.users;
				// const users = await User.find().sort({ x: 1 });
				console.log('users', users)

				const signersMatrix2 = [];
				const instructionsMatrix2 = [];

				for (let i = 0; i < users.length; i++) {
					let [userPool] = await PublicKey.findProgramAddress(
						[Buffer.from(USER_POOL_SEED), new PublicKey(users[i].wallet).toBuffer()],
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
						let instructions2: any[] = [];

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
					program.instruction.initDurationPoint({
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
					anchorWallet,
					[...instructionsMatrix, ...instructionsMatrix2],
					[...signersMatrix, ...signersMatrix2],
				);

				toast.success("The reward is allocated to users")
				// await sendTransaction(transaction, [], anchorWallet);
			}
		}
		catch (e) {
			console.error(e)
		}
	}

	const onDepositToken = async () => {
		console.log("test", solInputRef.current?.value)
		if (!solInputRef.current?.value || Number(solInputRef.current?.value) <= 0) {
			toast.error("Input sol amount, please.");
			return;
		}

		try {
			if (anchorWallet) {
				setShowLoader(true);
				const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
				const idl = STAKE_CONTRACT_IDL as anchor.Idl;

				const confirmOption: ConfirmOptions = {
					commitment: "finalized",
					preflightCommitment: "finalized",
					skipPreflight: false,
				};
				let provider = new anchor.Provider(connection, anchorWallet, confirmOption);
				let program = new anchor.Program(idl, programId, provider);

				const [globalAuthority] = await PublicKey.findProgramAddress(
					[Buffer.from(GLOBAL_AUTHORITY_SEED)],
					program.programId
				);

				var myToken = new Token(
					connection,
					rewardMint,
					TOKEN_PROGRAM_ID,
					wallet as any
				);
				let sourceRewardAccount = await getTokenWallet(anchorWallet.publicKey, rewardMint);
				console.log('source', sourceRewardAccount.toString());
				console.log('global', globalAuthority.toString());
				let srcAccInfo = await myToken.getAccountInfo(sourceRewardAccount);
				if (!srcAccInfo) {
					return;
				}

				let transaction = new Transaction();

				let destRewardAccount = await withFindOrInitAssociatedTokenAccount(
					transaction,
					provider.connection,
					rewardMint,
					globalAuthority,
					anchorWallet.publicKey,
					true
				);

				console.log('dest', destRewardAccount.toString());
				console.log('lamports for sol', web3.LAMPORTS_PER_SOL);


				let signers: Keypair[] = [];
				transaction.add(
					await program.instruction.depositToken(new anchor.BN(REWARD_TOKEN_DECIMALS * Number(solInputRef.current?.value)), {
						accounts: {
							globalAuthority: globalAuthority,
							owner: anchorWallet.publicKey,
							sourceAccount: sourceRewardAccount,
							destAccount: destRewardAccount,
							tokenProgram: TOKEN_PROGRAM_ID,
						},
					})
				);

				await sendTransaction(transaction, signers, anchorWallet);
				setShowLoader(false);
			}
		}
		catch (e) {
			console.error(e)
			setShowLoader(false);
		}
	}

	const onWithdrawToken = async () => {
		console.log("test", solInputRef.current?.value)
		if (!solInputRef.current?.value || Number(solInputRef.current?.value) <= 0) {
			toast.error("Input sol amount, please.");
			return;
		}

		try {
			if (anchorWallet) {
				setShowLoader(true);
				const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
				const idl = STAKE_CONTRACT_IDL as anchor.Idl;

				const confirmOption: ConfirmOptions = {
					commitment: "finalized",
					preflightCommitment: "finalized",
					skipPreflight: false,
				};
				let provider = new anchor.Provider(connection, anchorWallet, confirmOption);
				let program = new anchor.Program(idl, programId, provider);

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
					anchorWallet.publicKey,
					anchorWallet.publicKey,
					true
				);

				console.log('src', sourceRewardAccount.toString());
				console.log('dest', destRewardAccount.toString());
				console.log('lamports for sol', web3.LAMPORTS_PER_SOL);

				let signers: Keypair[] = [];
				transaction.add(
					await program.instruction.withdrawToken(new anchor.BN(REWARD_TOKEN_DECIMALS * Number(solInputRef.current?.value)), {
						accounts: {
							globalAuthority: globalAuthority,
							owner: anchorWallet.publicKey,
							sourceAccount: sourceRewardAccount,
							destAccount: destRewardAccount,
							tokenProgram: TOKEN_PROGRAM_ID,
						},
					})
				);

				await sendTransaction(transaction, signers, anchorWallet);
				setShowLoader(false);
			}
		}
		catch (e) {
			console.error(e)
			setShowLoader(false);
		}
	}
	const [minSidebar, setMinSiderBar] = useState(false);
	
	return (
		<div className="flex h-full-screen">
			{(showLoader) && <Loader text={"Loading"} />}
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="admin" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div className="text-center">
					<h1 className="text-4xl mt-5">Admin</h1>
					<div>
						<div className="flex items-center ml-5 py-5">
							<span>Total Staked NFTs : {globalData ? globalData.stakedCount : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>durationPoint : {globalData ? globalData.durationPoint.toNumber() : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>rarityPoint : {globalData ? globalData.rarityPoint.toNumber() : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>accountVerifyPoint : {globalData ? globalData.accountVerifyPoint.toNumber() : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>Available Token : {globalData ? Math.floor(globalData.availableTokenAmount.toNumber()/REWARD_TOKEN_DECIMALS * 100) / 100 : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>Allocated Token : {globalData ? Math.floor(globalData.allocatedTokenAmount.toNumber()/REWARD_TOKEN_DECIMALS * 100) / 100 : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<span>Claimed Token : {globalData ? Math.floor(globalData.claimedTokenAmount.toNumber()/REWARD_TOKEN_DECIMALS * 100) / 100  : 0}</span>
						</div>
						<div className="flex items-center ml-5 py-5">
							<input ref={solInputRef} type="number" className="py-3 px-3 rounded-2xl sm:w-1/4 w-full outline-none bg-LightPurple uppercase" placeholder="Input Token Amount" />
							<button onClick={onDepositToken} className="sm:ml-5 ml-2 mt-2 sm:mt-0 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl cursor-pointer">
								Deposit
							</button>
							<button onClick={onWithdrawToken} className="sm:ml-5 ml-2 mt-2 sm:mt-0 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl cursor-pointer">
								Withdraw
							</button>
							<button onClick={onAllocateReward} className="sm:ml-5 ml-2 mt-2 sm:mt-0 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl cursor-pointer mr-5">
								Allocate Rewards
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
