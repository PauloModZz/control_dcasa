import React, { useState, useEffect } from 'react';
import './ver_hilos.css';

const VerHilos = () => {
  const [imagenes, setImagenes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [color, setColor] = useState('');
  const [codigo, setCodigo] = useState('');
  const [marca, setMarca] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const URL_API = 'https://dcasa.onrender.com';

  useEffect(() => {
    fetch(`${URL_API}/api/uploads`)
      .then(res => res.json())
      .then(data => {
        const links = data.map(img => ({
          url: `${URL_API}${img.url}`,
          nombre: img.nombre,
          color: img.color,
          codigo: img.codigo,
          marca: img.marca
        }));
        setImagenes(links);
      })
      .catch(err => {
        console.error('Error al cargar imágenes:', err);
      });
  }, []);

  const manejarSeleccion = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setMensajeError('Solo se permiten imágenes PNG');
      setArchivo(null);
      setPreview(null);
    }
  };

  const confirmarSubida = () => {
    if (!archivo || !color || !codigo || !marca) {
      setMensajeError('Todos los campos son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('color', color);
    formData.append('codigo', codigo);
    formData.append('marca', marca);

    fetch(`${URL_API}/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          const nueva = {
            url: `${URL_API}${data.url}`,
            nombre: data.metadata.archivo,
            color: data.metadata.color,
            codigo: data.metadata.codigo,
            marca: data.metadata.marca
          };
          setImagenes([...imagenes, nueva]);
          setMensaje('Imagen subida correctamente');
          setMensajeError('');
          cerrarModal();
        } else {
          setMensaje('');
          setMensajeError('Error al subir imagen');
        }
      })
      .catch(() => {
        setMensaje('');
        setMensajeError('Error al subir imagen');
      });
  };

  const eliminarImagen = (nombre) => {
    fetch(`${URL_API}/api/upload/${nombre}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setImagenes(imagenes.filter(img => !img.url.includes(nombre)));
      });
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPreview(null);
    setArchivo(null);
    setColor('');
    setCodigo('');
    setMarca('');
    setMensajeError('');
  };

  return (
    <div className="contenedor">
      <h2>Gestión de Hilos</h2>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

      <div className="galeria">
        {imagenes.map((img, i) => (
          <div key={i} className="item">
            <img src={img.url} alt={`img-${i}`} />
            <p><strong>Color:</strong> {img.color}</p>
            <p><strong>Código:</strong> {img.codigo}</p>
            <p><strong>Marca:</strong> {img.marca}</p>
            <button onClick={() => eliminarImagen(img.url.split('/').pop())}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <button className="boton-flotante" onClick={() => setMostrarModal(true)}>+</button>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Subir nuevo hilo</h3>
            <input type="file" onChange={manejarSeleccion} accept="image/png" />
            {preview && <img src={preview} alt="preview" className="preview" />}
            <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="text" placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
            <div className="modal-botones">
              <button onClick={confirmarSubida}>Subir</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerHilos;
