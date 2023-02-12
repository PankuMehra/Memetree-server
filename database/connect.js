const mongoose = require("mongoose");
const config = require("../config/index");

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.MONGODB_CONNECTION_URL, (err) => {
      if (err) {
        console.log("Error in connecting to database");
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = connect;
