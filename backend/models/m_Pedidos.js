const mongoose = require('mongoose');

// Esquema para cada ítem del pedido
const itemSchema = new mongoose.Schema({
  cantidad: {
    type: Number,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
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
  items: {
    type: [itemSchema],
    required: true,
  },
  totalPedido: {
    type: Number,
    required: true,
  },
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

// Middleware para calcular totalPedido automáticamente
pedidoSchema.pre('validate', function (next) {
  this.totalPedido = this.items.reduce((sum, item) => sum + item.total, 0);
  next();
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
