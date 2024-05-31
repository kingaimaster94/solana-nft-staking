const passport = require('passport');
const User = require('../models/User');
const TwitterStrategy = require('passport-twitter').Strategy;
const socials = require('./cache');
const {setAccountVerifyPoint} = require('./utils')

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {

      try {

        const userExist = await User.findOne({ twitterId: profile.id });

        const user = await User.findById(req.query.userid);

        if (!userExist || (userExist.walletAddress === user.walletAddress)) {

          user.twitterId = Number(profile.id);
          user.twitterName = profile.username;
          socials.userTwitterMap.set(user.walletAddress, profile.id);
          user.save();
          if(user.discordId){
            setAccountVerifyPoint(user.walletAddress);
          }
          return done(null, { profile, user: req.user });

        } else {

          return done("Failed to register, A user with this twitter is registered");

        }

      } catch (e) {

        return done(e)

      }

    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
