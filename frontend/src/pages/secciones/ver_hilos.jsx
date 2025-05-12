import React, { useState, useEffect } from 'react';
import BotonCopiar from './BotonCopiar.jsx';
import '../styles/ver_estilos.css';

const VerHilos = () => {
  const [imagenes, setImagenes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await fetch('/ver_hilos.json');
      const data = await res.json();
      const links = data.map(({ nombre, color, codigo, marca }) => ({
        url: `/imagenes/${nombre}`,
        nombre,
        color,
        codigo,
        marca
      }));
      setImagenes(links);
    };
    obtenerDatos();
  }, []);

  const imagenesFiltradas = imagenes.filter(({ color, codigo, marca }) =>
    color.toLowerCase().includes(busqueda.toLowerCase()) || 
    codigo.includes(busqueda) || 
    marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="busqueda">
        <input 
          type="text" 
          placeholder="Buscar por color, código o marca..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </div>

      <div className="galeria">
        {imagenesFiltradas.map(({ url, color, codigo, marca }, i) => (
          <div key={i} className="item">
            <div className="copiar-wrapper">
              <BotonCopiar texto={`Color: ${color}\nCódigo: ${codigo}\nMarca: ${marca}`} />
            </div>
            <img src={url} alt={`img-${i}`} />
            <p><strong>Color:</strong> {color}</p>
            <p><strong>Código:</strong> {codigo}</p>
            <p><strong>Marca:</strong> {marca}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default VerHilos;
