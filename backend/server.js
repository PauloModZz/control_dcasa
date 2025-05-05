const express = require("express");
const cors = require("cors");
require("dotenv").config();
const conectarDB = require("./database/conexion");
const pedidosRoutes = require("./routes/r_pedidos"); // Cambié el nombre de las rutas

const app = express();

// Conectar a la base de datos
conectarDB();

app.use(cors());
app.use(express.json());

// Usar las rutas de pedidos
app.use("/api", pedidosRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando con MongoDB Atlas.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto:${PORT}`);
});
