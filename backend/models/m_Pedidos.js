const mongoose = require('mongoose');

// Esquema para cada ítem del pedido
const itemSchema = new mongoose.Schema({
  cantidad: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    enum: ['individual', 'porta vasos', 'porta platos', 'servilletas', 'cocteleras', 'toallas'],
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  marcaHilo: {
    type: String,
    required: true,
  },
  codigoHilo: {
    type: String,
    required: true,
  },
  colorHilo: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  notas: {
    type: String,
    default: '',
  }
});

// Esquema general del pedido
const pedidoSchema = new mongoose.Schema({
  numeroPedido: {
    type: Number,
    required: true,
    unique: true,
  },
  items: [itemSchema], // 🔥 Múltiples ítems por pedido
  estado: {
    type: String,
    enum: ['en proceso', 'terminado', 'entregado', 'cancelado'],
    default: 'en proceso',
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
