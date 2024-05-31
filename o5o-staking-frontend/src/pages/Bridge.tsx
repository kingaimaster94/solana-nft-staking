/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import Navbar from "../components/views/Navbar";
import Sidebar from "../components/views/Sidebar";
import Main from "../components/bridge/main.component";
import Set from "react-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Bridge = () => {
	const navigate = useNavigate();
	const [role, setRole] = useState<any>();
	useEffect(() => {
		const _role = localStorage.getItem("role");
		setRole(_role);
		console.log("role =", _role);
		// if(_role !== "admin") {
		// 	navigate("/home");
		// }
	}, [])

	const [minSidebar, setMinSiderBar] = useState(false);

	 // role === "admin" ? (
	return	<div className="flex h-full-screen">
			<Sidebar minSidebar={minSidebar} setMinSiderBar={setMinSiderBar} activeLink="bridge" />
			<div className="w-full h-full">
				<Navbar setMinSiderBar={setMinSiderBar} minSidebar={minSidebar}  globalData={undefined}/>
				<div className="pad-left-50">
					<Main/>
				</div>				
			</div>
		</div>
	// ) : <></>;
};

export default Bridge;