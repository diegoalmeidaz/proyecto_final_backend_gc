// orderController.test.js
const request = require("supertest");
const app = require("../../src/index.js"); // Asegúrate de exportar tu aplicación Express en app.js
const pool = require("../db/pool");

let authToken;

beforeAll(async () => {
  // Crear un usuario de prueba y obtener un token de autenticación
  const testUser = {
    email: "test@example.com",
    password: "testpassword",
    username:"test_user_jtest",
  };

  const registerResponse = await request(app).post("/users/register").send(testUser);
  const loginResponse = await request(app).post("/users/login").send(testUser);

  authToken = loginResponse.body.token;
});

afterAll(async () => {
  // Limpiar la base de datos y cerrar la conexión después de ejecutar las pruebas
  await pool.end();
});

describe("Order Controller", () => {
  describe("GET /orders/:order_id", () => {
    test("should return order data for a valid order ID", async () => {
      const orderId = 1; // Asume que hay una orden con ID 1 en la base de datos
      const response = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("order_id", orderId);
      // Agrega más expectativas según sea necesario
    });

    test("should return 404 for a non-existent order ID", async () => {
      const orderId = 99999; // Asume que no hay ninguna orden con este ID en la base de datos
      const response = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Order not found");
    });
  });

  // Agrega pruebas similares para las otras rutas y métodos del controlador de órdenes
});
