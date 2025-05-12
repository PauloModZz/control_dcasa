import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './ver_pedidos.css';

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    api.get('/pedidos')
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error('Error al obtener pedidos:', err));
  }, []);

  const toggleExpandido = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  return (
    <div className="contenedor-pedidos">
      <h1 className="titulo">Pedidos</h1>
      {pedidos.map((pedido) => (
        <div
          className="pedido-row"
          key={pedido._id}
          onClick={() => toggleExpandido(pedido._id)}
        >
          <div className="pedido-cabecera">
            <strong>Pedido #{pedido.numeroPedido}</strong> - {pedido.nombre_cliente}
          </div>
          {expandido === pedido._id && (
            <div className="pedido-detalle">
              <p><strong>Modelo:</strong> {pedido.modelo}</p>
              <p><strong>Material:</strong> {pedido.material}</p>
              <p><strong>Hilo:</strong> {pedido.hilo}</p>
              <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
              {pedido.items && pedido.items.length > 0 && (
                <>
                  <strong>Items:</strong>
                  <ul>
                    {pedido.items.map((item, index) => (
                      <li key={index}>
                        {item.descripcion} - {item.cantidad} unidades
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerPedidos;
