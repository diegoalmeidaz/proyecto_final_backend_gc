CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visit_date TIMESTAMP,
  rental_date TIMESTAMP,
  visit_date_txt VARCHAR(50),
  rental_date_txt VARCHAR(50),
  total_price BIGINT NOT NULL,
  status_order VARCHAR(250) NOT NULL,
  return_date TIMESTAMP,
  return_condition VARCHAR(250),
  delivery_address VARCHAR(500),
  payment_method VARCHAR(250),
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);
