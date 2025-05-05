const mongoose = require("mongoose");
require("dotenv").config();  // Esto carga las variables del archivo .env

const conectarDB = async () => {
  try {
    // Conectar a la base de datos de MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    // En caso de error, mostrar el mensaje y terminar el proceso
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);  // Terminar el proceso si la conexión falla
  }
};

module.exports = conectarDB;
