const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Crear carpeta si no existe
const storageDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
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
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo o el formato no es válido' });
  }

  const { color, codigo, marca } = req.body;

  if (!color || !codigo || !marca) {
    return res.status(400).json({ error: 'Faltan datos del hilo: color, código o marca' });
  }

  // Guardar los metadatos en un archivo JSON simple (opcional)
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

// Eliminar imagen
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(storageDir, filename);
  const jsonpath = path.join(storageDir, filename + '.json');

  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  if (fs.existsSync(jsonpath)) fs.unlinkSync(jsonpath);

  res.json({ mensaje: 'Imagen (y metadatos) eliminados correctamente' });
});

module.exports = router;
