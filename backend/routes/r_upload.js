const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Crear carpeta si no existe
const storageDir = path.join(__dirname, '..', 'uploads');

// Verificar si la carpeta 'uploads' existe, si no, crearla
if (!fs.existsSync(storageDir)) {
  console.log("La carpeta 'uploads' no existe. Creándola...");
  fs.mkdirSync(storageDir, { recursive: true });  // Asegúrate de crearla si no existe
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);  // Usamos el directorio 'uploads'
  },
  filename: function (req, file, cb) {
    // Nombre de archivo único basado en el timestamp
    const nombre = Date.now() + path.extname(file.originalname).toLowerCase();
    cb(null, nombre);
  }
});

// Filtro para aceptar solo imágenes PNG
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === '.png' && mime === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes en formato PNG'));
  }
};

const upload = multer({ storage, fileFilter });

// Ruta para subir imagen + datos adicionales
router.post("/", upload.single("imagen"), (req, res) => {
  console.log("Archivo recibido:", req.file);  // Para ver si el archivo fue recibido
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo o el formato no es válido' });
  }

  const { color, codigo, marca } = req.body;

  if (!color || !codigo || !marca) {
    return res.status(400).json({ error: 'Faltan datos del hilo: color, código o marca' });
  }

  // Guardar los metadatos en un archivo JSON
  const metadata = {
    archivo: req.file.filename,
    color,
    codigo,
    marca,
    fecha: new Date().toISOString()
  };

  const metadataPath = path.join(storageDir, req.file.filename + '.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  const url = `/uploads/${req.file.filename}`;
  res.json({ url, metadata });
});

// Ruta para eliminar imagen y metadatos
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(storageDir, filename);
  const jsonpath = path.join(storageDir, filename + '.json');

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);  // Eliminar imagen
    console.log("Imagen eliminada:", filepath);
  }

  if (fs.existsSync(jsonpath)) {
    fs.unlinkSync(jsonpath);  // Eliminar archivo JSON
    console.log("Metadatos eliminados:", jsonpath);
  }

  res.json({ mensaje: 'Imagen (y metadatos) eliminados correctamente' });
});

// Ruta para obtener la lista de imágenes con sus metadatos
router.get("/", (req, res) => {
  const archivos = fs.readdirSync(storageDir);
  const imagenes = archivos.filter(f => f.endsWith('.png'));

  const datos = imagenes.map(nombre => {
    const jsonPath = path.join(storageDir, nombre + '.json');
    let metadata = {};

    if (fs.existsSync(jsonPath)) {
      metadata = JSON.parse(fs.readFileSync(jsonPath));
    }

    return {
      url: `/uploads/${nombre}`,
      nombre,
      ...metadata
    };
  });

  res.json(datos);
});

module.exports = router;
