const {
createUser,
adminLogin,
getTweetInfo,
getUserList,
checkTwitterStatus,
checkDiscordStatus,
disconnectSocial,
setBridgeInfo,
getBridgeInfo
} = require('../controllers/user.controller');

const router = require('express').Router();


router.post('/', createUser);
router.get('/getUsers', getUserList);
router.get('/tweetInfo/:id', getTweetInfo);
router.get('/twitter/status/:id', checkTwitterStatus);
router.get('/discord/status/:id', checkDiscordStatus);

router.post('/admin', adminLogin);
router.post('/disconnect-social/:id/:social', disconnectSocial);

router.use(require('../middlewares/isAuthenticated'));
router.post('/setBridgeInfo',setBridgeInfo);
router.post('/getBridgeInfo',getBridgeInfo);

module.exports = router;
