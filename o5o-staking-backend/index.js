const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const cors = require('cors');
const cron = require('node-cron');

const passport = require('passport');
// require('./helpers/discordPassport');
require('./helpers/twitterPassport');
require('./helpers/cache');

const {calcDailyReward,setAccountVerifyPoint} = require('./helpers/utils')

db();

// var whitelist = ['http://localhost:3000','http://localhost:3001','https://dragon-front.vercel.app','http://127.0.0.1:3000', 'http://127.0.0.1:3001']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// app.use(cors(corsOptionsDelegate));
app.use(cors());
app.use(express.json());
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}`));

app.get('/', (req, res) => res.send('Home'));

app.use('/user', require('./routes/user.routes'));
app.use('/oauth', require('./routes/oauthRoutes'));
app.use('/admin', require('./routes/admin.routes'));

cron.schedule('0 0 * * *', () => {
  console.log('Calc Daily Reward');
  calcDailyReward();
});

// cron.schedule('0 0 28,31 * *', () => {
//   console.log('fetch data successfully');
// });

app.listen(process.env.PORT || 5000, () =>
  console.log(`APP RUNNING ON PORT ${process.env.PORT}`)
);
