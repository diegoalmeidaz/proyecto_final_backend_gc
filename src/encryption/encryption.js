// encryption.js
const CryptoJS = require('crypto-js');
const { SECRET_KEY } = require('../constants/ports');

function encrypt(data) {
  try {
    const stringifiedData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
  } catch (error) {
    console.error('Error en la encriptación:', error);
    return null;
  }
}

function decrypt(ciphertext) {
try {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
} catch (error) {
  console.error('Error en la desencriptación:', error);
  return null;
}
}


module.exports = {
  encrypt,
  decrypt,
};
