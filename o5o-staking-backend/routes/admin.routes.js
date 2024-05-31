const {
    saveTweet,
    getTweet,
    getTweetList,
    getAvailableUsers,
    getCheckedOptions,
    checkUserNameVerify,
    isAvailable
} = require('../controllers/tweet.controller');

const router = require('express').Router();

router.post('/saveTweet', saveTweet);
router.get('/getTweet', getTweet);
router.post('/checkUserNameVerify', checkUserNameVerify);
router.get('/getTweetList', getTweetList);
router.post('/availableUsers', getAvailableUsers);
router.post('/checkedOptions', getCheckedOptions);
router.post('/isAvailable',isAvailable);

module.exports = router;