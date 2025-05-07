import React, { useState, useEffect } from 'react';
import { FaClipboard } from 'react-icons/fa'; // Importar el ícono de copiar
import './ver_hilos.css';

const VerHilos = () => {
  const [imagenes, setImagenes] = useState([]);
  const [mensajeError, setMensajeError] = useState('');

  // Cargar el archivo JSON con los metadatos de las imágenes
  useEffect(() => {
    // Obtener el archivo JSON desde la carpeta public
    fetch('/ver_hilos.json')
      .then(res => res.json())
      .then(data => {
        const links = data.map(img => ({
          url: `/imagenes/${img.nombre}`,
          nombre: img.nombre,
          color: img.color,
          codigo: img.codigo,
          marca: img.marca
        }));
        setImagenes(links);
      })
      .catch(err => {
        console.error('Error al cargar el JSON de imágenes:', err);
        setMensajeError('Hubo un error al cargar las imágenes.');
      });
  }, []);

  // Función para copiar los datos al portapapeles
  const copiarAlPortapapeles = (color, codigo, marca) => {
    const texto = `Color: ${color}\nCódigo: ${codigo}\nMarca: ${marca}`;
    navigator.clipboard.writeText(texto)
      .then(() => alert('¡Datos copiados al portapapeles!'))
      .catch(err => alert('Error al copiar: ' + err));
  };

  return (
    <div className="contenedor">
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

      <div className="galeria">
        {imagenes.length === 0 ? (
          <p>No hay imágenes disponibles</p>
        ) : (
          imagenes.map((img, i) => (
            <div key={i} className="item">
              <img src={img.url} alt={`img-${i}`} />
              <p><strong>Color:</strong> {img.color}</p>
              <p><strong>Código:</strong> {img.codigo}</p>
              <p><strong>Marca:</strong> {img.marca}</p>

              {/* Ícono de copiar */}
              <button 
                className="copiar" 
                onClick={() => copiarAlPortapapeles(img.color, img.codigo, img.marca)}>
                <FaClipboard />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerHilos;
