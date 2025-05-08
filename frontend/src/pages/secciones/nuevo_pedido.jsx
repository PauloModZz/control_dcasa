import React, { useState, useEffect } from 'react';
import VerMaterial from './ver_material';
import './nuevo_pedido.css';

const NuevoPedido = () => {
  const [pedido, setPedido] = useState({
    cantidad: '',
    categoria: 'individual',
    notas: '',
    hiloSeleccionado: null,
    modeloSeleccionado: null,
    materialSeleccionado: null
  });

  const [mostrarPanel, setMostrarPanel] = useState(null);
  const [hilosDisponibles, setHilosDisponibles] = useState([]);
  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [itemsPedido, setItemsPedido] = useState([]);

  useEffect(() => {
    fetch('/ver_hilos.json').then(res => res.json()).then(data => setHilosDisponibles(data));
    fetch('/ver_modelos.json').then(res => res.json()).then(data => setModelosDisponibles(data));
  }, []);

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  const handleSeleccionHilo = (hilo) => {
    setPedido(prev => ({ ...prev, hiloSeleccionado: hilo }));
    setMostrarPanel(null);
  };

  const handleSeleccionModelo = (modelo) => {
    setPedido(prev => ({ ...prev, modeloSeleccionado: modelo }));
    setMostrarPanel(null);
  };

  const handleSeleccionMaterial = (material) => {
    setPedido(prev => ({ ...prev, materialSeleccionado: material }));
    setMostrarPanel(null);
  };

  const agregarItemAlPedido = () => {
    if (!pedido.hiloSeleccionado || !pedido.modeloSeleccionado || !pedido.materialSeleccionado) {
      setMensaje('❌ Selecciona hilo, modelo y material antes de agregar.');
      return;
    }
    const nuevoItem = {
      cantidad: pedido.cantidad,
      categoria: pedido.categoria,
      notas: pedido.notas,
      marcaHilo: pedido.hiloSeleccionado.marca,
      codigoHilo: pedido.hiloSeleccionado.codigo,
      colorHilo: pedido.hiloSeleccionado.color,
      modelo: pedido.modeloSeleccionado.nombre_modelo,
      material: pedido.materialSeleccionado.nombre_material
    };
    setItemsPedido(prev => [...prev, nuevoItem]);
    setPedido({ cantidad: '', categoria: 'individual', notas: '', hiloSeleccionado: null, modeloSeleccionado: null, materialSeleccionado: null });
    setMensaje('✅ Ítem agregado al pedido.');
  };

  return (
    <div className="contenedor-principal">
      <div className="card-formulario">
        <form className="formulario" onSubmit={e => { e.preventDefault(); agregarItemAlPedido(); }}>
          <h2>Nuevo Pedido</h2>
          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={pedido.cantidad} onChange={handleChange} required className="input-cantidad" />
          <label>Categoría:</label>
          <select name="categoria" value={pedido.categoria} onChange={handleChange} required>
            <option value="individual">Individual</option>
            <option value="porta vasos">Porta vasos</option>
            <option value="porta platos">Porta platos</option>
            <option value="servilletas">Servilletas</option>
            <option value="cocteleras">Cocteleras</option>
            <option value="toallas">Toallas</option>
          </select>
          <label>Hilo:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('hilo')}>
            {pedido.hiloSeleccionado ? `✅ ${pedido.hiloSeleccionado.color} ${pedido.hiloSeleccionado.codigo} (${pedido.hiloSeleccionado.marca})` : 'Seleccionar hilo'}
          </button>
          <label>Modelo:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('modelo')}>
            {pedido.modeloSeleccionado ? `✅ ${pedido.modeloSeleccionado.nombre_modelo}` : 'Seleccionar modelo'}
          </button>
          <label>Material:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('material')}>
            {pedido.materialSeleccionado ? `✅ ${pedido.materialSeleccionado.nombre_material}` : 'Seleccionar material'}
          </button>
          <label>Notas:</label>
          <textarea name="notas" value={pedido.notas} onChange={handleChange} className="textarea-notas" />
          <button type="submit">Agregar al pedido existente</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>

      {mostrarPanel && (
        <div className="card-panel">
          {mostrarPanel === 'hilo' && (
            <>
              <h2>Selecciona un hilo</h2>
              <div className="grid">
                {hilosDisponibles.map((hilo, index) => (
                  <div key={index} className="card" onClick={() => handleSeleccionHilo(hilo)}>
                    <img src={`/imagenes/${hilo.nombre}`} height="80" />
                    <p>{hilo.color}</p>
                    <p>{hilo.codigo}</p>
                    <p>{hilo.marca}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {mostrarPanel === 'modelo' && (
            <>
              <h2>Selecciona un modelo</h2>
              <div className="grid">
                {modelosDisponibles.map((modelo, index) => (
                  <div key={index} className="card" onClick={() => handleSeleccionModelo(modelo)}>
                    <img src={`/imagenes/${modelo.nombre_imagen}`} height="80" />
                    <p>{modelo.nombre_modelo}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {mostrarPanel === 'material' && (
            <VerMaterial onSeleccionar={handleSeleccionMaterial} />
          )}
        </div>
      )}

      {itemsPedido.length > 0 && (
        <div className="card-panel">
          <h2>Items del Pedido</h2>
          <ul>
            {itemsPedido.map((item, index) => (
              <li key={index}>
                {item.cantidad}x {item.categoria} | {item.colorHilo} ({item.codigoHilo}) - {item.modelo} - {item.material}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NuevoPedido;
