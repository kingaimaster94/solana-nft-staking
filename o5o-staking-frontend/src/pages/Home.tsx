/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import { STAKE_CONTRACT_IDL } from "../constant/contract";
import { GLOBAL_AUTHORITY_SEED, NEXT_PUBLIC_SOLANA_NETWORK, NEXT_PUBLIC_STAKE_CONTRACT_ID, REWARD_TOKEN_DECIMALS } from "../constant/env";
import * as anchor from "@project-serum/anchor";
import Loader from "../components/loader/Loader";
import Footer from "../components/views/Footer";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Home = () => {

	const anchorWallet = useAnchorWallet();
	const [showLoader, setShowLoader] = useState(false);
	const [globalData, setGlobalData] = useState<any>();
	const connection = new anchor.web3.Connection(
		NEXT_PUBLIC_SOLANA_NETWORK == "devnet"
			? "https://api.devnet.solana.com"
			: "https://metaplex.mainnet.rpcpool.com"
	);

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
	
	const [minSidebar, setMinSiderBar] = useState(false);
	
	// const src = "https://www.youtube.com/embed/d15DP5zqnYE";
	return (
		<div className="flex h-full-screen">
			{(showLoader) && <Loader text={"Loading"} />}
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="home" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={globalData}/>
				<div className="text-center">
					<h1 className="text-4xl mt-8" style={{ fontFamily: 'impact' }}>A new Web3 experience for
						all the true G`s out there</h1>
					<h1 className="text-sm mt-8 px-8">O5O the web3 music & fashion label.
						O5O is a first mover striving for quality, by developing a new sense of product experience in the web3 world.
						The O5O movement removes barriers & opens up new gateways for creatives in the music and the fashion space. we do the work which needs to be done to get artists to a stage where they truly become independent.
						We put all our energy into it, it's our choice, our commitment, our drive. we move first & represent our community!</h1>
					{/* <div className="mt-4">Total Locked Value : {globalData ? Math.floor(globalData.availableTokenAmount.toNumber()/REWARD_TOKEN_DECIMALS * 100) / 100 : 0}</div> */}
					<video className="mx-auto mt-5" width="60%" height="auto" controls>
					  <source src="O5O_Twitter.mp4" type="video/mp4"/>
					</video>
				</div>
			</div>
		</div>
	);
};

export default Home;
