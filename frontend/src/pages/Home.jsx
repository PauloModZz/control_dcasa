// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Home = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api.get('/pedidos')
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error('Error al obtener los pedidos:', err));
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

export default Home;
