// Importa las funciones encrypt y decrypt
const { encrypt, decrypt } = require('./encryption');

describe('Encryption and decryption', () => {
  test('should correctly encrypt and decrypt data', () => {
    // Prueba de encriptación y desencriptación
    const testData = {
      testField: "test value",
    };

    // Convertir el objeto testData a una cadena JSON
    const testDataString = JSON.stringify(testData);

    const encryptedData = encrypt(testDataString);
    expect(encryptedData).not.toEqual(testDataString);

    const decryptedDataString = decrypt(encryptedData);
    expect(JSON.parse(decryptedDataString)).toEqual(testData);


    // Convertir la cadena JSON decryptedDataString de vuelta a un objeto
    const decryptedData = JSON.parse(decryptedDataString);
    expect(decryptedData).toEqual(testData);
  });
});
