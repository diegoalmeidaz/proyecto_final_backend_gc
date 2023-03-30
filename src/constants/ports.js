const { config } = require('dotenv')
config()
const { PORT, SERVER_URL, CLIENT_URL, SECRET, SECRET_KEY } = process.env;

module.exports = {
  PORT: PORT,
  SERVER_URL: SERVER_URL,
  CLIENT_URL: CLIENT_URL,
  SECRET: SECRET,
  SECRET_KEY: SECRET_KEY,
}
 // comentario de prueba nueva redirigida github
