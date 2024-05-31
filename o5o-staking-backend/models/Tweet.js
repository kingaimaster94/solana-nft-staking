const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema(
  {
    year:
    {
      type: Number,
      required: true,
      unique: true
    },
    month:
    {
      type: Number,
      required: true,
      unique: true
    },
    tweetId: {
      type: String,
    },
    tweetLink : {
      type: String,
    },
    option: [{
      type: String,
      enum: ['Retweet', 'Like', 'Comment', 'Quoted Tweet'],
      default: 'Retweet'
    }],
    userName:
    {
      type: String,
    }
  }
  ,
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
