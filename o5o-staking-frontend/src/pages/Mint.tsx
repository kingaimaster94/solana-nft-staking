/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import Set from "react-icons";
import Bears from '../components/assets/bears.svg'
import { useState } from "react";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Mint = () => {
	const [minSidebar, setMinSiderBar] = useState(false);
	return (
		<div className="flex h-full-screen">
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="mint" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div className="text-center">
					<h1 className="text-4xl mt-5">Mint the O5O NFT</h1>
					<h3>Burn the Slimes to get them out of the Hood</h3>
					<img src={Bears} className="w-1/3 h-1/3 mx-auto my-4"></img>
					<h3>Select number of SLIMES to burn</h3>
					<h5>SLIMES in Wallet 0</h5>
					<div className="flex justify-center mt-3">
						<div className="mr-4 p-1">
							<div className="border-2 px-5 py-2">
								<button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
									<svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
									<span className="sr-only">Icon description</span>
								</button>
								<span>0</span>
								<button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center ml-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
									<svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
									<span className="sr-only">Icon description</span>
								</button>
							</div>
							<h3 className="text-sm">Max 0</h3>
						</div>
						<div className="p-1">
							<button type="button" className="h-14 inline-block px-6 py-0 bg-black text-white font-medium text-xs leading-tight uppercase rounded shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Mint</button>
						</div>
					</div>
					<h3 className="text-sm">Have fun enjoy the instant reveal after mint</h3>
				</div>
			</div>
		</div>
	);
};

export default Mint;
