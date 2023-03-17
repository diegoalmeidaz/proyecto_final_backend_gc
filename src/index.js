const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants/ports");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./middlewares/passport-middleware");
const cors = require("cors");
const db = require("./db/pool");

// Importa las rutas
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/items");
const ordersRouter = require("./routes/orders"); // Importa el enrutador de órdenes

// Configura los middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Inicializa las rutas
app.use("/users", authRoutes);
app.use("/items", productRoutes); // Agrega las rutas de productos
app.use("/orders", ordersRouter); // Agrega las rutas de órdenes

// Inicia el servidor
const appStart = () => {
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
appStart();
