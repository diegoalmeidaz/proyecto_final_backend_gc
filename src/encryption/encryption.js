// encryption.js
const CryptoJS = require('crypto-js');
const { SECRET_KEY } = require('../constants/ports');

function encrypt(text) {
    try {
      const stringifiedText = JSON.stringify(text);
      return CryptoJS.AES.encrypt(stringifiedText, SECRET_KEY).toString();
    } catch (error) {
      console.error('Error en la encriptación:', error);
      return null;
    }
  }

function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error en la desencriptación:', error);
    return null;
  }
}


module.exports = {
  encrypt,
  decrypt,
};
