const getTwitterOauth = () => {
    return process.env.TWITTER_BEARER;
}

module.exports = { getTwitterOauth };