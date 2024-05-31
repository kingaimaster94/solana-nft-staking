/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import Set from "react-icons";
import { useWallet } from '@solana/wallet-adapter-react';
import { BACKEND_URL } from "../constant/env";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Account = () => {
	const { publicKey, wallet } = useWallet();
	const [isTwitterConnecting, setTwitterConnecting] = useState(false);
	const [isDiscordConnecting, setDiscordConnecting] = useState(false);
	const [twitterName, setTwitterName] = useState('');
	const [discordName, setDiscordName] = useState('');

	const twitterLogin = async (e: any) => {
		if (!publicKey) {
			toast.error("Connect wallet, please.");
			return
		}
		try {
			const { data } = await axios.post(`${BACKEND_URL}/user`, {
				walletAddress: publicKey.toString(),
			});
			localStorage.setItem('wallet', publicKey ? publicKey.toString() : "");
			localStorage.setItem('token', JSON.stringify(data.data.token));
			const token = data.data.token;
			window.open(BACKEND_URL + "/oauth/twitter?token=" + token);
			setTwitterConnecting(true);
		} catch (error) {
			console.log(error);
			toast.error("Check network connection, please.");
		}
	};

	const discordLogin = async (e: any) => {
		if (!publicKey) {
			toast.error("Connect wallet, please.");
			return
		}
		try {
			const { data } = await axios.post(`${BACKEND_URL}/user`, {
				walletAddress: publicKey.toString(),
			});
			localStorage.setItem('wallet', publicKey ? publicKey.toString() : "");
			localStorage.setItem('token', JSON.stringify(data.data.token));
			const token = data.data.token;
			window.open(BACKEND_URL + "/oauth/discord?token=" + token);
			setDiscordConnecting(true);
		} catch (error) {
			console.log(error);
			toast.error("Check network connection, please.");
		}
	};

	useEffect(() => {
		if (isTwitterConnecting && publicKey) {
			let intervalId = setInterval(() => {
				axios.get(BACKEND_URL + "/user/twitter/status/" + publicKey?.toString())
					.then((res) => {
						if (res.status === 200) {
							setTwitterName(res.data.data.name)
							setTwitterConnecting(false);
						}
					})
					.catch((err) => {
						setTwitterName('')
						setTwitterConnecting(false);
					})
			}, 3000);

			return (() => {
				clearInterval(intervalId);
			})
		}
		if (isDiscordConnecting && publicKey) {
			let intervalId = setInterval(() => {
				axios.get(BACKEND_URL + "/user/discord/status/" + publicKey?.toString())
					.then((res) => {
						if (res.status === 200) {
							setDiscordName(res.data.data.name)
							setDiscordConnecting(false);
						}
					})
					.catch((err) => {
						setDiscordName('')
						setDiscordConnecting(false);
					})
			}, 3000);

			return (() => {
				clearInterval(intervalId);
			})
		}
	}, [isTwitterConnecting,isDiscordConnecting,publicKey]);	// handlers

	const [minSidebar, setMinSiderBar] = useState(false);
	
	return (
		<div className="flex h-full-screen">
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="account" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div className="text-center">
					<h1 className="text-4xl mt-5">Account</h1>
					<form className="w-full max-w-sm mx-auto mt-10">
						<div className="md:flex md:items-center mb-6">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
								Full Name
							</label>
						</div>
						<div className="md:flex md:items-center mb-6">
							<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" defaultValue="Jane Doe" />
						</div>
						<div className="md:flex md:items-center mb-6">
							<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
								Password
							</label>
						</div>
						<div className="md:flex md:items-center mb-6">
							<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" placeholder="******************" />
						</div>
						<div className="md:flex md:items-center mb-6" onClick={discordLogin}>
							Connect Discord
						</div>
						<div className="md:flex md:items-center mb-6" onClick={twitterLogin}>
							Connect Twitter
						</div>
						<div className="md:flex md:items-center">
							<button className="w-full shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
								Send Invite
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Account;
