/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useMediaQuery } from "react-responsive";
import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";
import WalletBtnImg from '../assets/wallet-icon.png';
import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import discord from "../assets/img/discord-white.png";
import twiter from "../assets/img/tweet-white.png";

interface SidebarInterface {
	activeLink: string
	setMinSiderBar: any
	minSidebar: any
}

const Sidebar = (props: SidebarInterface) => {
	//Media Quearry
	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 950px)" });
	const { publicKey, wallet, disconnect } = useWallet();
	const base58 = useMemo(() => publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58(), [publicKey]);
	const content = useMemo(() => {
		if (!wallet || !base58)
			return null;
		return base58.slice(0, 4) + '..' + base58.slice(-4);
	}, [wallet, base58]);

	const userRole = localStorage.getItem("role");
	const disableLinks = true;

	return (
		<div className={`${props && props.minSidebar ? 'display-flex' : ''} hidden sm:flex flex-col w-64 h-full px-4 py-8 border-r bg-white mobile-change`} >
			<div className="h-20">
				<Link to={"/home"}>
					<img src={logo} style={{ height: "80%", margin: "auto" }}></img>
				</Link>
			</div>
			<div className="flex flex-col justify-between mt-0">
				<aside>
					<ul>
						<Link to={"/home"} >
							<li>
								<span className={"flex items-center px-4 py-2 " + (props.activeLink == "home" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md "}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
									</svg>
									<span className="mx-4 font-medium">Home</span>
								</span>
							</li>
						</Link>

						<Link to={disableLinks ? "" : "/mint" } className="cursor-not-allowed">
							<li>
								<span className={"flex items-center px-4 py-2 mt-5 " + (props.activeLink == "mint" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md hover:bg-gray-200"}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span className="mx-4 font-medium">Mint</span>
								</span>
							</li>
						</Link>

						{/* userRole == "admin" && */  <Link to={"/bridge"}  >
						<li>
								<span className={"flex items-center px-4 py-2 mt-5 " + (props.activeLink == "bridge" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md hover:bg-gray-200"}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span className="mx-4 font-medium">Bridge</span>
								</span>
							</li>
						</Link>}

						<Link to={ disableLinks ? "" : "/stake"} className="cursor-not-allowed">
							<li>
								<span className={"flex items-center px-4 py-2 mt-5 " + (props.activeLink == "stake" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md hover:bg-gray-200"}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span className="mx-4 font-medium">Stake</span>
								</span>
							</li>
						</Link>

						<Link to={disableLinks ? "" : "/leaderboard"} className="cursor-not-allowed">
							<li>
								<span className={"flex items-center px-4 py-2 mt-5 " + (props.activeLink == "leaderboard" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md hover:bg-gray-200"}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span className="mx-4 font-medium">LeaderBoard</span>
								</span>
							</li>
						</Link>

						<Link to={disableLinks?  ""  : "/account"} className="cursor-not-allowed">
							<li>
								<span className={"flex items-center px-4 py-2 mt-5 " + (props.activeLink == "account" ? "text-gray-700 bg-gray-100" : "text-gray-600") + " rounded-md hover:bg-gray-200"}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span className="mx-4 font-medium">Account</span>
								</span>
							</li>
						</Link>

					</ul>
				</aside>
			</div>
			{/* <a href={"https://discord.gg/o5o"} className="box-border w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-32">
				<div className="flex"><img src={discord} alt="Discord" className="w-6" />&nbsp;&nbsp; Join Discord</div>
			</a>
			<a href={"https://twitter.com/o5o_official"} className="box-border w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-2">
				<div className="flex"><img src={twiter} alt="Twitter" className="w-6" />&nbsp;&nbsp; Join Twitter</div>
			</a> */}


		</div>
	);
};

export default Sidebar;
