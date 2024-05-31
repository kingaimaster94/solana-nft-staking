/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import Set from "react-icons";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constant/env";
import axios from "axios";
import Loader from "../components/loader/Loader";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const LeaderBoard = () => {

	const [users, setUsers] = useState<any[]>([]);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		try {
			setLoading(true);
			axios.get(`${BACKEND_URL}/user/getUsers`).then((res) => {
				console.log('users', res.data.users);
				setUsers(res.data.users);
				setLoading(false);
			}).catch(()=>{
				setLoading(false);
			});
		}
		catch (e) {
			setLoading(false);
		}
	}, []);

	const [minSidebar, setMinSiderBar] = useState(false);

	return (
		
		<div className="flex h-full-screen">
			{(isLoading) && <Loader text={''} />}
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="leaderboard" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div className="text-center">
					<h1 className="text-4xl mt-5">LeaderBoard</h1>
					<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 mt-8">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Rank
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Size of Gang
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Average Rarity score
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Player Name
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Wallet
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Twitter Account
								</th>
								<th
									scope="col"
									className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
								>
									Total Points
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 text-center">
							{users && users.map((item, index) => {
								return (
									<tr key={index}>
										<td className="text-center px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
											{index + 1}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.stakedCount}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.averageRarityPoint}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.playerName}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.wallet}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.twitterName}
										</td>
										<td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
											{item.totalPoint}
										</td>
									</tr>
								)

							})}
						</tbody>
					</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderBoard;
