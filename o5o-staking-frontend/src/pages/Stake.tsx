/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import Set from "react-icons";
import Bears from '../components/assets/bears.svg'

import StakeItem from "../components/views/Stake";
import UnStake from "../components/views/UnStake";

import useWalletNfts from "../hooks/use-wallet-nfts";
import useNftStake from "../hooks/use-nft-stake";
import Loader from "../components/loader/Loader";
import toast from "react-hot-toast";


import Logo from "../components/assets/logo.png";
import WalletIcon from "../components/assets/wallet-icon.png";
import Telegram from "../components/assets/telegram.png";
import Twitter from "../components/assets/Twitter.png";
import Instagram from "../components/assets/instagram.png";

import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";


const Stake = () => {

	const [showLoader, setShowLoader] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [dispMode, setDispMode] = useState(true);
	const [unStackProductIds, setUnStackProduct] = useState<number[]>([]);
	const [stakedProductIds, setStakedProduct] = useState<number[]>([]);
	const [refreshFlag, setRefreshFlag] = useState(false);
	const {
		isLoading,
		stakedNfts,
		claimAmount,
		stakedCount,
		stakeNftList,
		unStakeNft,
		claimRewards,
		setStakedNfts,
	} = useNftStake();

	const { isLoadingWalletNfts, walletNfts, setWalletNfts } =
		useWalletNfts();

	const onClaimToken = () => {
		setShowLoader(true);
		claimRewards().then(() => {
			stopLoader()
		}).catch((err) => {
			stopLoader()
			console.log(err);
		});
	}

	const handleUnstackProduct = (e: boolean, i: number) => {
		console.log("handleUnstackProduct", e, i)
		if (e) {
			setUnStackProduct([...unStackProductIds, i]);
		} else {
			setUnStackProduct(unStackProductIds.filter((item) => item !== i));
		}
	};

	const handleStakedProduct = (e: boolean, i: number) => {
		console.log("handleStakedProduct", e, i)
		if (e) {
			setStakedProduct([...stakedProductIds, i]);
		} else {
			setStakedProduct(stakedProductIds.filter((item) => item !== i));
		}
	};

	const handleStake = async () => {
		if (unStackProductIds.length + stakedCount <= 2) {
			toast.error("You should select more than 3 NFTs to generate Gang, please.");
			return;
		}
		setShowLoader(true);
		let stakeMode = 0;
		let staking_nfts = [];
		for (let i = 0; i < unStackProductIds.length; i++) {
			staking_nfts.push(walletNfts[unStackProductIds[i]]);
		}
		var filtered = walletNfts.filter(function (value, index, arr) {
			return unStackProductIds.indexOf(index) === -1;
		});

		const res = await stakeNftList(stakeMode, staking_nfts);
		if (res === 1) {
			setUnStackProduct([]);
			setStakedNfts(stakedNfts.concat(staking_nfts));
			setWalletNfts(filtered);
		}
	};

	const handleUnStake = async () => {
		if (stakedProductIds.length <= 0) {
			toast.error("Select NFTs, please");
			return;
		}

		setShowLoader(true);
		let unstaking_nfts = [];
		for (let i = 0; i < stakedProductIds.length; i++) {
			unstaking_nfts.push(stakedNfts[stakedProductIds[i]]);
		}

		var filtered = stakedNfts.filter(function (value, index, arr) {
			return stakedProductIds.indexOf(index) === -1;
		});

		const res = await unStakeNft(unstaking_nfts);
		if (res === 1) {
			setStakedProduct([]);
			setWalletNfts(walletNfts.concat(unstaking_nfts));
			setStakedNfts(filtered);
		}
	};

	const handleUnStakeAll = async () => {
		if (stakedNfts.length <= 0) {
			toast.error("No NFTs.");
			return;
		}
		setShowLoader(true);
		const res = await unStakeNft(stakedNfts);
		console.log("res", res);
		if (res === 1) {
			setStakedProduct([]);
			setWalletNfts(walletNfts.concat(stakedNfts));
			setStakedNfts([]);
		}
	};

	const stopLoader = () => {
		setShowLoader(false);
		setLoadingMessage("");
		setRefreshFlag(!refreshFlag);
	};

	const [minSidebar, setMinSiderBar] = useState(false);

	return (
		<div className="flex bg-gray-100 h-full-screen">
			{(showLoader || isLoading || isLoadingWalletNfts) && <Loader text={loadingMessage} />}
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="stake" />
			<div className="w-full h-full bg-gray-100">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div id="info" className=" border-b border-grey-light h-24 px-4 py-2 box-content">
					<div className="flex flex-col sm:flex-row item-center justify-between flex-grow h-24 gap-2">
						<div className="flex items-center justify-around sm:justify-between gap-4">
							<button 
							onClick={() => {
								setDispMode(true)
							}} 
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
								Your wallet
							</button>
							<button onClick={() => {
								setDispMode(false)
							}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
								Staked&nbsp;as&nbsp;Gang
							</button>
						</div>
						<div className="flex items-center justify-center sm:justify-start">
							<span className="mr-4">Claimable Reward</span>
							<span className="mr-2"> {claimAmount}</span>
							<span className="mr-4">$o5o</span>
							<button onClick={onClaimToken} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mr-4">
								Claim&nbsp;All
							</button>
							<span className="mr-4">info</span>
						</div>
					</div>
				</div>
				<div className="text-center">
					<h1 className="text-sm mt-5">Send your Gang on the block to hustle some $O5O</h1>
					{
						dispMode ?
							<>
								<div className="mt-5">
									<span className="mr-2">{unStackProductIds.length}</span>
									<span className="mr-4">Gang members selected</span>
									<button onClick={() => {
										handleStake().then(() => {
											stopLoader()
											setDispMode(false);
										})
									}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mr-4">
										Generate Gang
									</button>
								</div>
								<div className="justify-between mt-10">
									<div className="flex gap-3 flex-wrap mt-3 bg-white px-4">
										{walletNfts.length > 0 ? walletNfts.map((nft, idx) => {
											return <StakeItem key={idx}
												selected={unStackProductIds.indexOf(idx) !== -1}
												nft={nft}
												index={idx}
												image={nft.image}
												name={nft.name}
												handleOrderCollect={handleUnstackProduct} />;
										}) : <div style={{
											padding: "6em 1em",
											textAlign: "center",
											justifyContent: "center",
											alignItems: "center",
											// backgroundColor: "lightblue",
											width: "100%",
											borderRadius: "10px",
											margin: "1em 1em"
										}}>{!(showLoader || isLoading || isLoadingWalletNfts) && "No NFTs"}</div>}
									</div>
								</div>
							</> :
							<>
								<div className="mt-5">
									<span className="mr-2">{stakedProductIds.length}</span>
									<span className="mr-4">Gang members selected</span>
									<button onClick={() => {
										if ((stakedCount - stakedProductIds.length) <= 2) {
											handleUnStakeAll().then(() => {
												stopLoader()
												setDispMode(true);
											})
										}
										else {
											handleUnStake().then(() => {
												stopLoader()
												setDispMode(true);
											})
										}
									}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mr-4">
										Remove from Gang
									</button>
								</div>
								<div className="justify-between mt-10">
									<div className="flex gap-3 flex-wrap mt-3 bg-white px-4">
										{stakedNfts.length > 0 ? stakedNfts.map((nft, idx) => {
											return <UnStake key={idx}
												selected={stakedProductIds.indexOf(idx) !== -1}
												nft={nft}
												index={idx}
												image={nft.image}
												name={nft.name}
												handleOrderCollect={handleStakedProduct} />;
										}) : <div style={{
											padding: "6em 1em",
											textAlign: "center",
											justifyContent: "center",
											alignItems: "center",
											// backgroundColor: "lightblue",
											width: "100%",
											borderRadius: "10px",
											margin: "1em 1em"
										}}>{!(showLoader || isLoading || isLoadingWalletNfts) && "No NFTs"}</div>}
									</div>
								</div>
							</>
					}
				</div>
			</div>
		</div>
	);
};

export default Stake;
