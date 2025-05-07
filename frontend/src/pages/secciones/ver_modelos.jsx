// src/secciones/ver_modelos.jsx
import React, { useState, useEffect } from 'react';
import { FaClipboard } from 'react-icons/fa';
import './ver_hilos.css';

const VerModelos = () => {
  const [imagenes, setImagenes] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/ver_modelos.json')
      .then(res => res.json())
      .then(data => {
        const links = data.map(img => ({    
        url: `/imagenes/${img.nombre}`, // Correcto, como en ver_hilos.jsx
          nombre: img.nombre
        }));
        setImagenes(links);
      })
      .catch(err => {
        console.error('Error al cargar el JSON de modelos:', err);
        setMensajeError('Hubo un error al cargar los modelos.');
      });
  }, []);

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const imagenesFiltradas = imagenes.filter((img) =>
    img.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor">
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

      <div className="busqueda">
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={busqueda} 
          onChange={manejarBusqueda} 
        />
      </div>

      <div className="galeria">
        {imagenesFiltradas.length === 0 ? (
          <p>No hay modelos disponibles para esa búsqueda</p>
        ) : (
          imagenesFiltradas.map((img, i) => (
            <div key={i} className="item">
              <img src={img.url} alt={`modelo-${i}`} />
              <p><strong>Nombre:</strong> {img.nombre}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerModelos;
