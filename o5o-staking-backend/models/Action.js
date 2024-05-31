const mongoose = require('mongoose');

const actionSchema = mongoose.Schema(
    {
        tweetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        option: [{
            type: String,
            enum: ['Retweet', 'Like', 'Comment', 'Quoted Tweet']
        }],
        userName: {
            type: String
        }
    }
    ,
    {
        timestamps: true,
    }
);

const Action = mongoose.model('Action', actionSchema);
module.exports = Action;