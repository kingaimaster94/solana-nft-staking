const { handleAsync } = require('../helpers/handleAsync');
const { generateToken } = require('../helpers/TokenService');

const axios = require("axios");

const Tweet = require('../models/Tweet');
const { getTwitterOauth } = require('../helpers/getTwitterOauth');
const { use } = require('passport');
const User = require('../models/User');

const { Client } = require('twitter-api-sdk');

const likes = "https://api.twitter.com/2/tweets/:id/liking_users?tweet.fields=author_id";
const rts = "https://api.twitter.com/2/tweets/:id/retweeted_by";
const qrts = "https://api.twitter.com/2/tweets/:id/quote_tweets?tweet.fields=author_id";
const replies = "https://api.twitter.com/2/tweets/search/recent?tweet.fields=author_id&query=conversation_id::id";

const LIKE = 'Like';
const COMMENT = 'Comment';
const RETWEET = 'Retweet';
const QUOTE = 'Quoted Tweet';
const DEVMODE = true;


function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

const saveTweet = handleAsync(async (req, res) => {
    const { tweetLink, option, userName } = req.body;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    console.log('saveTweet -> ', tweetLink, option, userName, month, year)
    try {
        if (userName) {
            const tweet = await Tweet.findOne({
                year,
                month
            });

            if (tweet) {
                tweet.userName = userName;
                await tweet.save();
                return res.status(200).json({
                    message: 'Success',
                });
            } else {
                const saveTweet = new Tweet({
                    userName,
                    month,
                    year
                });

                await saveTweet.save();
                return res.status(201).json({
                    message: 'Success',
                });
            }
        }
        else if (tweetLink) {
            const tweetId = tweetLink.split("/").pop();
            if (tweetId && containsOnlyNumbers(tweetId)) {
                const tweet = await Tweet.findOne({
                    year,
                    month
                });

                if (tweet) {
                    tweet.tweetId = tweetId;
                    tweet.option = option;
                    await tweet.save();
                    return res.status(200).json({
                        message: 'Success',
                    });
                } else {
                    const saveTweet = new Tweet({
                        tweetId,
                        option,
                        tweetLink,
                        month,
                        year
                    });

                    await saveTweet.save();
                    return res.status(200).json({
                        message: 'Success',
                    });
                }
            }
        }
    }
    catch (e) {
        console.log(e)
    }

    return res.status(201).json({ message: 'Invalid Request' });
});

const getTweet = handleAsync(async (req, res) => {
    const month = new Date().getMonth() + 1;
    const tweet = await Tweet.findOne({ month });
    if (tweet) {
        return res.status(200).json({
            tweet: tweet,
            message: 'Success'
        });
    }
    else {
        return res.status(201).json({
            message: 'Tweet for this month is not setted'
        });
    }
});

const getTweetList = handleAsync(async (req, res) => {
    const tweets = await Tweet.find().sort({ x: 1 });
    return res.status(200).json({
        tweets: tweets,
        message: 'Success'
    });
});

const getLikedUsers = async (id) => {
    console.log("getLikedUsers")
    let _like = (await axios.get(likes.replace(":id", id), {
        headers: {
            Authorization: `Bearer ${getTwitterOauth()}`
        }
    }).catch(e => e++))?.data;

    let like = [];

    if (_like?.data?.length > 0) {
        _like.data = _like.data.map(v => v.id);

        like.push(..._like.data);

        while (_like?.meta?.next_token) {
            const __like = (await axios.get(likes.replace(":id", id) + `&pagination_token=${_like?.meta?.next_token}`, {
                headers: {
                    Authorization: `Bearer ${getTwitterOauth()}`
                }
            }).catch(e => console.log(e)))?.data;

            _like = __like;

            if (!_like?.data) break;

            _like.data = _like.data.map(v => v.id);
            like.push(..._like.data);
            // await new Promise(res => setTimeout(res, 600))
        }
    }
    console.log("getLikedUsers", like)
    return like;
}

const getRetweetedUsers = async (id) => {
    console.log("getRetweetedUsers");
    let _rt = (await axios.get(rts.replace(":id", id), {
        headers: {
            Authorization: `Bearer ${getTwitterOauth()}`
        }
    }).catch(e => e++))?.data;

    let rt = [];

    if (_rt?.data?.length > 0) {
        _rt.data = _rt.data.map(v => v.id);

        rt.push(..._rt.data);

        while (_rt?.meta?.next_token) {
            const __rt = (await axios.get(rts.replace(":id", id) + `?pagination_token=${_rt?.meta?.next_token}`, {
                headers: {
                    Authorization: `Bearer ${getTwitterOauth()}`
                }
            }).catch(e => null))?.data;

            _rt = __rt;

            if (!_rt?.data) break;

            _rt.data = _rt.data.map(v => v.id);
            rt.push(..._rt.data)
        }
    }
    console.log("getRetweetedUsers", rt);
    return rt;
}

const getQuotedUsers = async (id) => {
    console.log("getQuotedUsers");
    let _qrt = (await axios.get(qrts.replace(":id", id), {
        headers: {
            Authorization: `Bearer ${getTwitterOauth()}`
        }
    }).catch(e => e++))?.data;

    let qrt = [];

    if (_qrt?.data?.length > 0) {
        _qrt.data = _qrt.data.map(v => v.author_id);

        qrt.push(..._qrt.data);

        while (_qrt?.meta?.next_token) {
            const __qrt = (await axios.get(qrts.replace(":id", id) + `&pagination_token=${_qrt?.meta?.next_token}`, {
                headers: {
                    Authorization: `Bearer ${getTwitterOauth()}`
                }
            }).catch(e => null))?.data;

            _qrt = __qrt;

            if (!_qrt?.data) break;

            _qrt.data = _qrt.data.map(v => v.author_id);
            qrt.push(..._qrt.data)
        }
    }
    console.log("getQuotedUsers", qrt);
    return qrt;
}

const getRepliedUsers = async (id) => {
    console.log("getRepliedUsers");
    let _reply = (await axios.get(replies.replace(":id", id), {
        headers: {
            Authorization: `Bearer ${getTwitterOauth()}`
        }
    }).catch(e => e++))?.data;

    let reply = [];

    if (_reply?.data?.length > 0) {
        _reply.data = _reply.data.map(v => v.author_id);

        reply.push(..._reply.data);

        while (_reply?.meta?.next_token) {
            const __reply = (await axios.get(replies.replace(":id", id) + `&pagination_token=${_reply?.meta?.next_token}`, {
                headers: {
                    Authorization: `Bearer ${getTwitterOauth()}`
                }
            }).catch(e => null))?.data;

            _reply = __reply;

            if (!_reply?.data) break;

            _reply.data = _reply.data.map(v => v.author_id);
            reply.push(..._reply.data)
        }
    }
    console.log("getRepliedUsers", reply);
    return reply;
}

const getAvailableUsers = handleAsync(async (req, res) => {
    // const { tweetID, option } = req.body;
    // if (
    //     !tweetId ||
    //     !option
    // ) {
    //     return res
    //         .status(400)
    //         .json({ message: "Missing some fields" });
    // }
    //
    const tweet = (await Tweet.find().sort({ x: 1 }))[0];
    let users = [];
    if (tweet) {
        if (tweet.option == "Retweet") {
            users = await getRetweetedUsers(tweet.tweetId);
        }
        else if (tweet.option == "Like") {
            users = await getLikedUsers(tweet.tweetId);
        }
        else if (tweet.option == "Comment") {
            users = await getRepliedUsers(tweet.tweetId);
        }
        else {
            users = await getQuotedUsers(tweet.tweetId);
        }
    }
    console.log('---------getAvailableUsers--------', users);

    return res.status(200).json({
        message: 'Success',
        data: {
            available_users: users
        },
    });
});

const isAvailable = handleAsync(async (req, res) => {
    const { walletAddress, tweetId, option } = req.body;
    const user = await User.findOne({
        walletAddress,
    }).select('+role');

    if (!user) {
        return res.status(200).json({
            message: 'Invalid User',
            checked: false
        });
    }

    console.log("option", option);

    let users = [];
    if (option == "Retweet") {
        users = await getRetweetedUsers(tweetId);
    }
    else if (option == "Like") {
        users = await getLikedUsers(tweetId);
    }
    else if (option == "Comment") {
        users = await getRepliedUsers(tweetId);
    }
    else {
        users = await getQuotedUsers(tweetId);
    }
    console.log('---------isAvailable--------', users);
    if (DEVMODE) {
        return res.status(200).json({
            message: 'Success',
            checked: users.indexOf(user.twitterId) == -1
        });
    }
    return res.status(200).json({
        message: 'Success',
        checked: users.indexOf(user.twitterId) !== -1
    });
});

const getCheckedOptions = handleAsync(async (req, res) => {
    const { walletAddress, tweetId } = req.body;

    const user = await User.findOne({
        walletAddress,
    }).select('+role');

    if (!user) {
        return res.status(200).json({
            message: 'Invalid User',
            checkedOptions: []
        });
    }

    let users = [];
    const checkedOptions = [];
    users = await getRetweetedUsers(tweetId);
    if (users.indexOf(user.twitterId) !== -1) {
        checkedOptions.push("Retweet");
    }
    users = await getLikedUsers(tweetId);
    if (users.indexOf(user.twitterId) !== -1) {
        checkedOptions.push("Like");
    }
    users = await getRepliedUsers(tweetId);
    if (users.indexOf(user.twitterId) !== -1) {
        checkedOptions.push("Comment");
    }
    users = await getQuotedUsers(tweetId);
    if (users.indexOf(user.twitterId) !== -1) {
        checkedOptions.push("Quoted Tweet");
    }

    return res.status(200).json({
        message: 'Success',
        checkedOptions: checkedOptions
    });
});

const checkUserNameVerify = handleAsync(async (req, res) => {
    const { walletAddress, userName} = req.body;
    try{
        const user = await User.findOne({
            walletAddress,
        }).select('+role');
    
        if (!user) {
            return res.status(200).json({
                message: 'Invalid User',
                checked: false
            });
        }
    
        const response = await getUserNameMentioned(userName);
        return res.status(200).json({
            message: 'Success',
            res: response.indexOf(user.twitterId) != -1
        });
    }
    catch(e){
        return res.status(200).json({
            message: 'Failed',
            res: false
        });
    }
});


async function getUserNameMentioned(userName) {
    const client = new Client(process.env.TWITTER_BEARER);
    const res = await client.users.findUserByUsername(userName);
    console.log('---user---',res.data)
    let _rt = await client.tweets.usersIdMentions(res.data.id,{"tweet.fields": ["author_id"]});
    let rt = [];
    if (_rt?.data?.length > 0) {
        _rt.data = _rt.data.map(v => v.id);
        rt.push(..._rt.data);
    }
    console.log("getUserNameMentioned", rt);
    return rt;
}


module.exports = {
    saveTweet,
    getTweet,
    getTweetList,
    checkUserNameVerify,
    getAvailableUsers,
    getCheckedOptions,
    isAvailable
}