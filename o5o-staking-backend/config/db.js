const mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose
      .connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Mongoose Connected"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
