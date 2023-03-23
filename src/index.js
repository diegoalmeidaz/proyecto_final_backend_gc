// index.js
const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants/ports");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./middlewares/passport-middleware");
const cors = require("cors");
const db = require("./db/pool");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/items");
const ordersRouter = require("./routes/orders");
const roleRouter = require('./routes/role');
const userRoleRouter = require('./routes/userRole');

// Configura los middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Inicializa las rutas
app.use("/users", authRoutes);
app.use("/items", productRoutes);
app.use("/orders", ordersRouter);
app.use('/roles', roleRouter);
app.use('/user_roles', userRoleRouter);

// Exporta la aplicación Express
module.exports = app;

// Inicia el servidor
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`El servidor está escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

// Verifica la conexión con la base de datos
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar a la base de datos", err.stack);
  } else {
    console.log("Conexión exitosa a la base de datos:", res.rows[0]);
  }
});

// Inicia la aplicación
startServer();
