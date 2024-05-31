const passport = require('passport');
const router = require('express').Router();

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/error',
  }),
  function (req, res) {
    res.send('<script>window.close()</script>');
  }
);

router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/error',
  }),
  function (req, res) {
    res.send('<script>window.close()</script>');
  }
);

router.use(require('../middlewares/isAuthenticated'));

router.get('/twitter', (req, res, next) => {
  passport.authenticate('twitter', {
    callbackURL:
      `${process.env.BASE_URL}/oauth/twitter/callback?userid=` + req.user._id,
  })(req, res, next);
});

router.get('/discord', (req, res, next) => {
  passport.authenticate('discord', {
    state: JSON.stringify({ userid: req.user._id }),
  })(req, res, next);
});

module.exports = router;
