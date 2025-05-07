const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const conectarDB = require("./database/conexion");
const pedidosRoutes = require("./routes/r_pedidos");
const app = express();

// Conectar a la base de datos
conectarDB();

app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api", pedidosRoutes); // Solo ruta para pedidos

app.get("/", (req, res) => {
  res.send("Servidor funcionando con MongoDB Atlas.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto:${PORT}`);
});
