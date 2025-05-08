const express = require('express');
const Pedido = require('../models/m_Pedidos'); // Ruta correcta a tu modelo
const router = express.Router();

// 📌 Crear un nuevo pedido con número autoincremental y varios ítems
router.post('/pedidos', async (req, res) => {
  try {
    // Obtener todos los números actuales
    const pedidos = await Pedido.find({}, 'numeroPedido').sort({ numeroPedido: 1 });
    const numeros = pedidos.map(p => p.numeroPedido);

    // Encontrar el primer hueco
    let numeroPedido = 1;
    for (let i = 0; i < numeros.length; i++) {
      if (numeros[i] !== numeroPedido) break;
      numeroPedido++;
    }

    const nuevoPedido = new Pedido({
      numeroPedido,
      items: req.body.items, // Aquí se recibe el array completo de ítems
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
  }
});

// 📌 Obtener todos los pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
});

// 📌 Obtener un pedido por ID
router.get('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el pedido', error: error.message });
  }
});

// 📌 Actualizar pedido
router.put('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error: error.message });
  }
});

// 📌 Eliminar pedido
router.delete('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.status(200).json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el pedido', error: error.message });
  }
});

module.exports = router;
