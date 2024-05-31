/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Circles } from 'react-loader-spinner'
import { BACKEND_URL, COMMENT, LIKE, QUOTE, RETWEET } from "../../constant/env";
import axios from "axios";
import CloneIcon from "../assets/Close.png";
import toast from 'react-hot-toast';

interface UserModalInterface {
    tweetId: string;
    walletAddress: string | undefined;
    handleClose: (isShowing: boolean) => void;
}

const UserModal = (props: UserModalInterface) => {
    const { tweetId, walletAddress } = props;

    const onClickButton = async (e: any) => {

    }

    useEffect(() => {

    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-ModalBg flex items-center justify-center p-4">
            <div className="bg-Modal rounded-borderRadiusCard w-full max-w-xl p-7 max-h-1/5 overflow-y-auto myscroller" style={{ overflow: 'auto', maxHeight: 700 }}>
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-2xl capitalize staking font-bold">
                        Verify the tweet link
                    </h1>
                    <div
                        className="w-4 cursor-pointer"
                        onClick={() => props.handleClose(false)}
                    >
                        <img src={CloneIcon} alt="close" />
                    </div>
                </div>

                <div className="mt-8 flex justify-evenly">
                    <input className="py-3 px-3 rounded-2xl sm:w-3/4 w-full outline-none bg-LightPurple" placeholder="Enter Twitter Id" />
                    <button
                        className={"sm ml-1 mr-1 bg-gradient-to-r from-primary to-secondary py-2 px-8 rounded-2xl"}
                        onClick={onClickButton}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
