const request = require("supertest-session");
const app = require("../../src/index.js");
const { pool } = require("../db/pool");

const testSession = request(app);

let authToken;

const testUser = {
  email: "test@example.com",
  password: "testpassword",
  username: "test_user_jtest",
  name: "testunsername",
  lastname: "testuserlastname"
};

beforeAll(async () => {
  // Insert test data in orders table
  const orderQuery = `
    INSERT INTO orders (order_id, user_id, total_price, status_order)
    VALUES (1, 20, 1000, 'Test status');
  `;
  await pool.query(orderQuery);

  // Insert test data in items table
  const itemQuery = `
  INSERT INTO items (
    item_id, name, color, price, category, src, is_liked, purchase_year, purchase_country,
    description, short_description, renter_name, renter_lastname, renter_email, availability,
    size, laundry_charge, renters_commision, safe_deposit, independent_designer_dress,
    user_id, purchase_price_paid_by_renter
  ) VALUES (
    50, 'Ficticio Vestido Elegante', 'Rojo', 1500, 'Vestidos', 'https://example.com/ficticio_vestido.jpg',
    true, 2022, 'México', 'Vestido rojo largo y elegante para ocasiones especiales',
    'Vestido rojo elegante', 'Juan', 'Pérez', 'juan.perez@example.com', true,
    'M', 100, 0.1, 500, false, 20, '1000'
  );
`;
  await pool.query(itemQuery);

  // Insert test data in order_details table
  const orderDetailsQuery = `
    INSERT INTO order_details (order_id, item_id, quantity, price)
    VALUES (1, 50, 1, 1500);
  `;
  await pool.query(orderDetailsQuery);

  authToken = await loginAndGetToken();
});

afterAll(async () => {
  // Delete test data from order_details and orders tables
  const orderDetailsQuery = `
    DELETE FROM order_details
    WHERE order_id = 1;
  `;
  await pool.query(orderDetailsQuery);

  const orderQuery = `
    DELETE FROM orders
    WHERE order_id = 1;
  `;
  await pool.query(orderQuery);

  // Delete test data from items table
  const itemQuery = `
    DELETE FROM items
    WHERE item_id = 50;
  `;
  await pool.query(itemQuery);

  await pool.end();

  
});

const loginAndGetToken = async () => {
  await testSession.post("/users/register").send(testUser);
  const response = await testSession.post("/users/login").send(testUser);

  return response.headers["set-cookie"][0]
    .split(";")[0]
    .replace("token=", "");
};

describe("Order Controller", () => {
    describe("GET /orders/:order_id", () => {
      beforeEach(async () => {
        authToken = await loginAndGetToken();
      });
  
      test("should return order data for a valid order ID", async () => {
        const orderId = 1;
        const response = await testSession
          .get(`/orders/${orderId}`)
          .set("Authorization", `Bearer ${authToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("order_id", orderId);
      });
  
      test("should return 404 for a non-existent order ID", async () => {
        const orderId = 999999;
        const response = await testSession
          .get(`/orders/${orderId}`)
          .set("Authorization", `Bearer ${authToken}`);
  
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Order not found");

      });
    });
  });
  