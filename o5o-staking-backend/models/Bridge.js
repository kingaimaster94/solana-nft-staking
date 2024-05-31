const mongoose = require('mongoose');

const bridgeSchema = mongoose.Schema(
  {
    solanaAddress: {
      type: String,
      required: true,
    },
    evmAddress: {
      type: String,
      required: true,
    },
    amount:{
      type: Number,
      required: true,
    }
  }
  ,
  {
    timestamps: true,
  }
);

const Bridge = mongoose.model('Bridge', bridgeSchema);
module.exports = Bridge;
