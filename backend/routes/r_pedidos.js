const express = require('express');
const Pedido = require('../models/m_Pedidos'); // Asegúrate que este path es correcto
const router = express.Router();

// Crear un nuevo pedido con número autoincremental y reutilizando huecos
router.post('/pedidos', async (req, res) => {
  try {
    // Obtener los números de pedido existentes, ordenados
    const pedidos = await Pedido.find({}, 'numeroPedido').sort({ numeroPedido: 1 });
    const numerosExistentes = pedidos.map(p => p.numeroPedido);

    // Buscar el primer número faltante en la secuencia
    let numeroPedido = 1;
    for (let i = 0; i < numerosExistentes.length; i++) {
      if (numerosExistentes[i] !== numeroPedido) break;
      numeroPedido++;
    }

    // Crear nuevo pedido con el número asignado
    const nuevoPedido = new Pedido({ ...req.body, numeroPedido });
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
  }
});

// Obtener todos los pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
});

// Obtener un pedido por ID
router.get('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el pedido', error: error.message });
  }
});

// Actualizar un pedido
router.put('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el pedido', error: error.message });
  }
});

// Eliminar un pedido
router.delete('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el pedido', error: error.message });
  }
});

module.exports = router;
