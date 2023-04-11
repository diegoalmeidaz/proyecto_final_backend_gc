const { config } = require('dotenv')
config()
const { PORT, SERVER_URL, CLIENT_URL, SECRET, SECRET_KEY, CLIENT_URL_LOCAL } = process.env;

module.exports = {
  PORT: PORT,
  SERVER_URL: SERVER_URL,
  CLIENT_URL: CLIENT_URL,
  CLIENT_URL_LOCAL: CLIENT_URL_LOCAL,
  SECRET: SECRET,
  SECRET_KEY: SECRET_KEY,
}
 // comentario de prueba nueva redirigida github
