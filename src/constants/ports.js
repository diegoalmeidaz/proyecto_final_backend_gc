const { config } = require('dotenv')
config()
const { PORT_ENV, SERVER_URL, CLIENT_URL, SECRET_ENV, SECRET_KEY } = process.env;

module.exports = {
  PORT: PORT_ENV,
  SERVER_URL: SERVER_URL,
  CLIENT_URL: CLIENT_URL,
  SECRET: SECRET_ENV,
  SECRET_KEY: SECRET_KEY,
}
 // comentario de prueba nueva redirigida github
 