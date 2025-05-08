import React, { useEffect, useState } from 'react';
import '../styles/ver_estilos.css';

const VerMaterial = ({ onSeleccionar }) => {
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    fetch('/ver_material.json')
      .then(res => res.json())
      .then(data => {
        const links = data.map(material => ({
          url: `/imagenes/${material.nombre_imagen}`,
          nombre_material: material.nombre_material
        }));
        setMateriales(links);
      });
  }, []);

  return (
    <>
      <h2>Selecciona un material</h2>
      <div className="grid">
        {materiales.map((material, i) => (
          <div key={i} className="card" onClick={() => onSeleccionar(material)}>
            <img src={material.url} alt={`material-${i}`} height="80" />
            <p>{material.nombre_material}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default VerMaterial;
