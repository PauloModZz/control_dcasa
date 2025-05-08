import React, { useState, useEffect } from 'react';
import BotonCopiar from './BotonCopiar.jsx';
import '../styles/ver_estilos.css';


const VerModelos = () => {
  const [modelos, setModelos] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/ver_modelos.json')
      .then(res => res.json())
      .then(data => {
        const links = data.map(modelo => ({
          url: `/imagenes/${modelo.nombre_imagen}`,
          nombre_modelo: modelo.nombre_modelo
        }));
        setModelos(links);
      })
      .catch(err => {
        console.error('Error al cargar el JSON de modelos:', err);
        setMensajeError('Hubo un error al cargar los modelos.');
      });
  }, []);

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const modelosFiltrados = modelos.filter((modelo) =>
    modelo.nombre_modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor">
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

      <div className="busqueda">
        <input 
          type="text" 
          placeholder="Buscar modelo..." 
          value={busqueda} 
          onChange={manejarBusqueda} 
        />
      </div>

      <div className="galeria">
        {modelosFiltrados.length === 0 ? (
          <p>No hay modelos disponibles para esa búsqueda</p>
        ) : (
          modelosFiltrados.map((modelo, i) => (
            <div key={i} className="item">
              <div className="copiar-wrapper">
                <BotonCopiar texto={`Modelo: ${modelo.nombre_modelo}`} />
              </div>
              <img src={modelo.url} alt={`modelo-${i}`} />
              <p><strong>Modelo:</strong> {modelo.nombre_modelo}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerModelos;
