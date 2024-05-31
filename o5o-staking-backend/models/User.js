const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      required: true,
      select: false,
      default: 'user',
      enum: ['user', 'admin'],
    },
    twitterId: {
      type: String,
      default: '',
    },
    twitterName: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    }
  }
  ,
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
