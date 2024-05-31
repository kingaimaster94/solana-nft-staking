/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Circles } from 'react-loader-spinner'
import { BACKEND_URL, COMMENT, LIKE, QUOTE, RETWEET } from "../../constant/env";
import axios from "axios";
import CloneIcon from "../assets/Close.png";
import toast from 'react-hot-toast';

interface ClaimListModalInterface {
    handleClose: (isShowing: boolean) => void;
    handleTweet: (isShowing: boolean) => void;
    handleUser: (isShowing: boolean) => void;
}

interface Tweet {
    month: String,
    userName: String,
}

const CliamListModal = (props: ClaimListModalInterface) => {

    console.log('modalProps', props)

    const [tweetList, setTweetList] = useState<Tweet[]>([]);

    useEffect(() => {
        try {
            axios.get(`${BACKEND_URL}/admin/getTweetList`).then((res) => {
                if (res.status == 200) {
                    setTweetList(res.data.tweets);
                }
            }).catch((err) => {

            });
        }
        catch (e) {

        }
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-ModalBg flex items-center justify-center p-4">
            <div className="bg-Modal rounded-borderRadiusCard w-full max-w-4xl p-7 max-h-1/5 overflow-y-auto myscroller" style={{ overflow: 'auto', maxHeight: 700 }}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl capitalize staking font-bold">
                        Claimable Rewards
                    </h1>

                    <div
                        className="w-4 cursor-pointer"
                        onClick={() => props.handleClose(false)}
                    >
                        <img src={CloneIcon} alt="close" />
                    </div>
                </div>
                <div>
                    <table className="w-full min-h-full">
                        <thead>
                            <tr >
                                <th>
                                    Month
                                </th>
                                <th>
                                    Reward Amount
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tweetList.map((item, index) => {
                                    return (
                                        <tr className="text-center" key={index}>
                                            <td className="py-1">
                                                {item.month}
                                            </td>
                                            <td >
                                                $2999
                                            </td>
                                            <td>
                                                <button onClick={() => {
                                                    if (item.userName) {
                                                        props.handleUser(true)
                                                    }
                                                    else {
                                                        props.handleTweet(true)
                                                    }
                                                }} className="" disabled={false}>
                                                    Claim
                                                </button>
                                            </td>
                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CliamListModal;
