// src/pages/secciones/ver_pedidos.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api.get('/pedidos')
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error('Error al obtener pedidos:', err));
  }, []);

  return (
    <div>
      <h1>Pedidos</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido._id}>
            #{pedido.numeroPedido} - {pedido.modelo} - {pedido.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerPedidos;
