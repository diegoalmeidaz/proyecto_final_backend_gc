const { encrypt } = require("../encryption/encryption");
const { updateUserInfoAndRole } = require("../controllers/userRoleController");

test("should update user info and roles successfully", async () => {
  // Preparar los datos de prueba
  const userId = 13;
  const updatedInfo = {
    name: "Updated Name",
    lastname: "Updated Lastname",
    email: "updated.email@example.com",
    username: "updatedUsername",
    roles: [1, 2],
    phone: "123456789",
    address: "Updated Address",
  };

  // Encriptar los datos antes de enviarlos a la función
  const encryptedData = encrypt(updatedInfo);
  console.log("Datos encriptados:", encryptedData);

  // Simular la petición y la respuesta
  const req = {
    params: { user_id: userId },
    body: { encryptedData },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Llamar a la función updateUserInfoAndRole
  await updateUserInfoAndRole(req, res);

  // Comprobar si se devuelve el código de estado correcto y la respuesta correcta
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "User info and roles updated successfully",
    user: expect.objectContaining({
      user_id: userId,
      name: updatedInfo.name,
      lastname: updatedInfo.lastname,
      email: updatedInfo.email,
      username: updatedInfo.username,
      phone: updatedInfo.phone,
      address: updatedInfo.address,
    }),
  });

  // Aquí también puedes incluir verificaciones adicionales, como asegurarte de que los roles se hayan actualizado correctamente en la base de datos.
});
