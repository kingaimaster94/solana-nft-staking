const socials = require('../helpers/cache');
const { handleAsync } = require('../helpers/handleAsync');
const { generateToken } = require('../helpers/TokenService');
const Bridge = require('../models/Bridge');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const { use } = require('passport');
const {getUsers} = require('../helpers/utils')

const createUser = handleAsync(async (req, res) => {
    const { walletAddress } = req.body;
    const user = await User.findOne({
        walletAddress,
    }).select('+role');

    if (user) {
        const token = await generateToken(walletAddress);
        return res.status(200).json({
            message: 'Success',
            data: {
                token,
                role: user.role,
            },
        });
    } else {
        const saveUser = new User({
            walletAddress,
        });

        const savedUser = await saveUser.save();
        if (savedUser) {
            const token = await generateToken(walletAddress);

            return res.status(201).json({
                message: 'Success',
                data: {
                    token,
                    role: 'user',
                },
            });
        }
    }
    return res.status(400).json({ message: 'Invalid Request', data: [] });
});

const setBridgeInfo = handleAsync(async (req, res) => {
    const { solanaAddress , evmAddress, amount } = req.body;
    console.log(solanaAddress,evmAddress,amount)

    const saveBridge = new Bridge({
        solanaAddress,
        evmAddress,
        amount
    });

    const savedBridge = await saveBridge.save();
    if (savedBridge) {
        return res.status(201).json({
            message: 'Success',
            data: {
                data: savedBridge,
            },
        });
    }

    return res.status(400).json({ message: 'Invalid Request', data: [] });
});

const getBridgeInfo = handleAsync(async (req, res) => {

    const bridges = await Bridge.find();

    return res.status(201).json({
        message: 'Success',
        data: {
            data: bridges,
        },
    });

});

const adminLogin = handleAsync(async (req, res) => {
    const { walletAddress } = req.body;
    const user = await User.findOne({
        walletAddress
    }).select('+role');

    if (user.role !== 'admin') {
        return res.status(400).json({
            message: 'Not an admin',
            data: []
        });
    }

    const token = await generateToken(walletAddress);
    res.status(200).json({
        message: 'Success',
        data: {
            token,
            role: user.role,
        },
    });
});

const checkTwitterStatus = handleAsync(async (req, res) => {
    const wallet = req.params.id;
    if (socials.userTwitterMap.get(wallet)) {
        const user = await User.findOne({ walletAddress: wallet });

        if (!user.twitterId) {
            return res
                .status(404)
                .json({ message: "Twitter not found!" });
        }

        return res.json({
            data: {
                status: 'Success',
                name: user.twitterName
            },
            message: "Twitter status sent"
        });
    }
    else {
        const user = await User.findOne({ walletAddress: wallet });
        if (user.twitterId) {
            return res.json({
                data: {
                    status: 'Success',
                    name: user.twitterName
                },
                message: "Twitter status sent"
            });
        }
    }

    return res
        .status(404)
        .json({ message: "Twitter not found!" });
});

const getTweetInfo = handleAsync(async (req, res) => {
    const wallet = req.params.id;
    const tweet = (await Tweet.find().sort({ x: 1 }))[0];
    const user = await User.findOne({ walletAddress: wallet });

    return res.json({
        data: {
            status: 'Success',
            name: user && user.twitterName ? user.twitterName : "",
            tweetId: tweet ? tweet.tweetId : "",
            option: tweet ? tweet.option : [],
            userName: tweet ? tweet.userName : ""
        },
        message: "Twitter status sent"
    });
});

const getUserList = handleAsync(async (req, res) => {
    getUsers().then((data) => {
        console.log(data);
        return res.status(200).json({
            users: data,
            message: 'Success'
        });
    })
});


const checkEnableClaim = handleAsync(async (req, res) => {
    const { wallet, tweetId } = req.body;
    const tweet = await Tweet.findOne({ tweetId: tweetId });
    let isEnable = false;

    if (tweet && tweet.actedUsers.indexOf(wallet) != -1) {
        isEnable = true;
    }

    return res.json({
        data: {
            status: 'Success',
            isEnable: isEnable
        },
        message: "Twitter status sent"
    });
});

const disconnectSocial = handleAsync(async (req, res) => {
    const wallet = req.params.id;
    const social = req.params.social;
    try {
        const user = await User.findOne({ walletAddress: wallet });
        if (!user) throw new Error()
        if (social === "twitter") {
            user.twitterId = null
            user.twitterName = null
        } else if (social === "discord") {
            user.discordId = null
            user.discordName = null
        } else {
            return res
                .status(404)
                .json({ message: "Invalid Social!" });
        }
        await user.save()
        return res.json({
            data: {
                status: 'Success'
            },
            message: social + " removed"
        });
    } catch (error) {
        return res
            .status(404)
            .json({ message: "Server Error!" });
    }
});

const checkDiscordStatus = handleAsync(async (req, res) => {
    const wallet = req.params.id;
    if (socials.userDiscordMap.get(wallet)) {
        const user = await User.findOne({ walletAddress: wallet });
        if (!user.discordId) {
            return res
                .status(404)
                .json({ message: "Discord not found!" });
        }
        return res.json({
            data: {
                status: 'Success',
                name: user.discordName
            },
            message: "Discord status sent"
        });
    }
    else {
        const user = await User.findOne({ walletAddress: wallet });
        if (user.discordId) {
            return res.json({
                data: {
                    status: 'Success',
                    name: user.discordName
                },
                message: "Discord status sent"
            });
        }
    }
    return res
        .status(404)
        .json({ message: "Discord not found!" });
});

module.exports = {
    createUser,
    checkTwitterStatus,
    checkDiscordStatus,
    getTweetInfo,
    getUserList,
    disconnectSocial,
    adminLogin,
    setBridgeInfo,
    getBridgeInfo
}