const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
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

// Ruta para subir una imagen
router.post("/", upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo o el formato no es válido' });
  }

  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// Eliminar imagen
router.delete('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
  
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ mensaje: 'Imagen eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
  
module.exports = router;
