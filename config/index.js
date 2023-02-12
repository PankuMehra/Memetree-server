require("dotenv").config();

const config = {
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL,
};

module.exports = config;
