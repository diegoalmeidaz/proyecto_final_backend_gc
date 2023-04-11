// index.js
const express = require("express");
const app = express();
const { PORT, CLIENT_URL, CLIENT_URL_LOCAL } = require("./constants/ports");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./middlewares/passport-middleware");
const cors = require("cors");
const db = require("./db/pool");
const path = require("path");

// swagger

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Guapa Carlota API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/items");
const ordersRouter = require("./routes/orders");
const roleRouter = require("./routes/role");
const userRoleRouter = require("./routes/userRole");

// Configura los middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [CLIENT_URL, CLIENT_URL_LOCAL];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));


app.use(passport.initialize());

app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

// Inicializa las rutas
app.use("/users", authRoutes);
app.use("/items", productRoutes);
app.use("/orders", ordersRouter);
app.use("/roles", roleRouter);
app.use("/user_roles", userRoleRouter);

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
