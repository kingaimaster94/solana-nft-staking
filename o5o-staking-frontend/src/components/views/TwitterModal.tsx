/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Circles } from 'react-loader-spinner'
import { BACKEND_URL, COMMENT, LIKE, QUOTE, RETWEET } from "../../constant/env";
import axios from "axios";
import CloneIcon from "../assets/Close.png";
import toast from 'react-hot-toast';

interface TwitterModalInterface {
    tweetId: string;
    walletAddress: string | undefined;
    options: Array<string>;
    handleClose: (isShowing : boolean) => void;
    handleClaimEnable : (isEnable : boolean) => void;
}

const TwitterModal = (props: TwitterModalInterface) => {
    const [isLoadingTweet, setTweetLoading] = useState(true);
    const { options, tweetId, walletAddress } = props;
    console.log('modalProps', props, options)
    const [isLiked, setLiked] = useState(false);
    const [isCommented, setCommented] = useState(false);
    const [isRetweeted, setRetweeted] = useState(false);
    const [isQuoted, setQuoted] = useState(false);
    const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

    const onTweetLoaded = () => {
        setTweetLoading(false); 
        console.log("Twitter loaded"); 
    }
    const onClickButton = async (e: any) => {
        if (e.target.innerText == LIKE) {
            const { data } = await axios.post(`${BACKEND_URL}/admin/isAvailable`, {
                walletAddress: walletAddress,
                tweetId : tweetId,
                option : LIKE
            });
            console.log('response',data)
            if(data.checked){
                setLiked(true);
                if(checkedOptions.indexOf(LIKE) == -1){
                    checkedOptions.push(LIKE);
                }
            }
        } else if (e.target.innerText == COMMENT) {
            const { data } = await axios.post(`${BACKEND_URL}/admin/isAvailable`, {
                walletAddress: walletAddress,
                tweetId : tweetId,
                option : COMMENT
            });
            if(data.checked){
                setCommented(true);
                if(checkedOptions.indexOf(COMMENT) == -1){
                    checkedOptions.push(COMMENT);
                }
            }
        } else if (e.target.innerText == RETWEET) {
            const { data } = await axios.post(`${BACKEND_URL}/admin/isAvailable`, {
                walletAddress: walletAddress,
                tweetId : tweetId,
                option : RETWEET
            });
            if(data.checked){
                setRetweeted(true);
                if(checkedOptions.indexOf(RETWEET) == -1){
                    checkedOptions.push(RETWEET);
                }
            }
        } else {
            const { data } = await axios.post(`${BACKEND_URL}/admin/isAvailable`, {
                walletAddress: walletAddress,
                tweetId : tweetId,
                option : QUOTE
            });
            if(data.checked){
                setQuoted(true);
                if(checkedOptions.indexOf(QUOTE) == -1){
                    checkedOptions.push(QUOTE);
                }
            }
        }

        if(checkedOptions.length == options.length){
            toast.success("Congratulations! You can claim now.");
            props.handleClaimEnable(true);
        }
    }

    const isChecked = (option : string) => {
        if(option == LIKE){
            return isLiked;
        }
        else if(option == RETWEET){
            return isRetweeted;
        }
        else if(option == COMMENT){
            return isCommented;
        }
        else{
            return isQuoted;
        }        
    }

    useEffect(()=> {
        console.log('get checked options')
        axios.post(`${BACKEND_URL}/admin/checkedOptions`, {
            walletAddress: walletAddress,
            tweetId: tweetId 
        }).then((res)=>{
            console.log('res',res);
            setCheckedOptions(res.data.checkedOptions)
            if(res.data.checkedOptions.indexOf(LIKE) !== -1){
                setLiked(true);
            }
            if(res.data.checkedOptions.indexOf(COMMENT) !== -1){
                setCommented(true);
            }
            if(res.data.checkedOptions.indexOf(RETWEET) !== -1){
                setRetweeted(true);
            }
            if(res.data.checkedOptions.indexOf(QUOTE) !== -1){
                setQuoted(true);
            }
        }).catch((err)=>{

        });
    },[])

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-ModalBg flex items-center justify-center p-4">
            <div className="bg-Modal rounded-borderRadiusCard w-full max-w-xl p-7 max-h-1/5 overflow-y-auto myscroller" style={{overflow:'auto', maxHeight:700}}>
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-2xl capitalize staking font-bold">
                        share this tweet to win reward
                    </h1>
                    <div
                        className="w-4 cursor-pointer"
                        onClick={() => props.handleClose(false)}
                    >
                        <img src={CloneIcon} alt="close" />
                    </div>
                </div>
                {isLoadingTweet ? <div>
                    < Circles
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="circles-loading"
                        wrapperStyle={{ justifyContent: 'center' }
                        }
                        wrapperClass=""
                        visible={true}
                    />
                </div > : ''}
                <TwitterTweetEmbed
                    onLoad={onTweetLoaded}
                    tweetId={tweetId}
                />
                
                <div className="mt-8 flex justify-evenly">
                    {
                        options.map((item, index) => {
                            return (<button key={index}
                                className={"sm ml-1 mr-1 " + (isChecked(item) ? "bg-gradient-to-r cursor-not-allowed" : "gradient-border") + " from-primary to-secondary py-1 px-8 rounded-2xl"}
                                onClick={onClickButton}
                            >
                                {item}
                            </button>);
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default TwitterModal;
