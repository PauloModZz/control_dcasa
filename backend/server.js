const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const conectarDB = require("./database/conexion");
const pedidosRoutes = require("./routes/r_pedidos");
const uploadRoutes = require("./routes/r_upload"); // nueva ruta

const app = express();

// Conectar a la base de datos
conectarDB();

app.use(cors());
app.use(express.json());

// Hacer pública la carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use("/api", pedidosRoutes);
app.use("/api/upload", uploadRoutes); // ruta para subir imagen

app.get("/", (req, res) => {
  res.send("Servidor funcionando con MongoDB Atlas.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto:${PORT}`);
});
