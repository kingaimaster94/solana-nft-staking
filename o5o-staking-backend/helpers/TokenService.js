const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = async (walletAddress) => {
  try {
    const token = jwt.sign({ walletAddress }, process.env.JWTSECRET, {
      expiresIn: '1d',
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};

const decodeToken = async (req, token) => {
  try {
    if (token) {
      const decodedData = jwt.verify(token, process.env.JWTSECRET);

      const user = await User.findOne({
        walletAddress: decodedData.walletAddress,
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.log(error.name);
    console.log(error);
  }
};

module.exports = { generateToken, decodeToken };
