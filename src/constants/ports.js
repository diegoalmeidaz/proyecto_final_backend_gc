const { config } = require('dotenv')
config()


module.exports = {
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.SERVER_URL,
  SECRET: "6742890",
  SECRET_KEY: process.env.SECRET_KEY,
}
