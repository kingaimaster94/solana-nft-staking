/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui/lib/WalletMultiButton";
import Bears from '../components/assets/bears.svg'
import Logo from "../components/assets/logo.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant/env";
import axios from "axios";


// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Index = () => {
    const { publicKey, wallet } = useWallet();
    let navigate = useNavigate();

    useEffect(() => {
        try {
            // axios.get(`${BACKEND_URL}/admin/getTweet`).then((res) => {
            // 	if (res.status == 200) {
            // 		console.log('tweet', res.data.tweet);
            // 		setTweetLink(res.data.tweet.tweetLink);
            // 		setTweetId(res.data.tweet.tweetId);
            // 		setUserName(res.data.tweet.userName);
            // 		setTweetOptions(res.data.tweet.option);
            // 	}
            // }).catch((err) => {
            // 	console.log('error', err)
            // })
            if (wallet && publicKey) {
                console.log("index");
                axios.post(`${BACKEND_URL}/user`, {
                    walletAddress: publicKey.toString(),
                }).then((res) => {
                    console.log('res', res);
                    localStorage.setItem("role", res.data.data.role);
                    localStorage.setItem("wallet", publicKey.toString());
                    localStorage.setItem("token", JSON.stringify(res.data.data.token));
                    navigate("/home");
                });
            }
        } catch (error) {
            console.error(error);
        }
    }, [wallet, publicKey]);

    return (
        <div className="lg:flex h-full-screen bg-black" style={{zIndex: -10}}>
            <div className="absolute flex bg-white border-2 top-10 left-5 sm:left-40 right-5 sm:right-40 border-purple-800 justify-between items-center">
                <img src={Logo} className="ml-5 my-4" style={{ height: "60px" }}></img>
                <div className="mr-10">
                    <WalletMultiButton />
                </div>
            </div>
            <div className="home-container">
                {/* Left  */}
                <div className="flex-1 w-full">
                    <div className="h-full flex justify-center items-center">
                        <div className=" pt-52 sm:pt-0 pb-10 px-6 sm:px-0" >
                            <h1 className="text-5xl text-white" style={{ fontFamily: 'impact' }}>
                                FRESHEST ON WEB3
                            </h1>
                            <h1 className="text-white mt-5">
                                Get access to a never seen experience & build your GANG
                            </h1>
                            <WalletMultiButton className="mt-5" />
                        </div>
                    </div>
                </div>
                {/* Right  */}
                <div className="flex-1 w-full">
                    {/* <div className="h-full bg-white" style={{ backgroundImage: `url(${Bears})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} /> */}
                    <img src={Bears} className="h-auto sm:h-screen sm:object-cover" alt="bears" />
                </div>
            </div>
        </div>
    );
};

export default Index;
