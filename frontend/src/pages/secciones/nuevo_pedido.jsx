import React, { useState, useEffect } from 'react';
import VerMaterial from './ver_material';
import './nuevo_pedido.css';

const NuevoPedido = () => {
  const [pedido, setPedido] = useState({
    cantidad: '',
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
    fetch('/ver_hilos.json').then(res => res.json()).then(setHilosDisponibles);
    fetch('/ver_modelos.json').then(res => res.json()).then(setModelosDisponibles);
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
    const { cantidad, hiloSeleccionado, modeloSeleccionado, materialSeleccionado, notas } = pedido;

    if (!hiloSeleccionado || !modeloSeleccionado || !materialSeleccionado) {
      setMensaje('❌ Selecciona hilo, modelo y material antes de agregar.');
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setMensaje('❌ Ingresa una cantidad válida.');
      return;
    }

    const precioUnitario = parseFloat(modeloSeleccionado.precio);
    const total = precioUnitario * cantidadNum;

    const nuevoItem = {
      cantidad: cantidadNum,
      modelo: modeloSeleccionado.nombre_modelo,
      precioUnitario,
      total,
      marcaHilo: hiloSeleccionado.marca,
      codigoHilo: hiloSeleccionado.codigo,
      colorHilo: hiloSeleccionado.color,
      material: materialSeleccionado.nombre_material,
      notas
    };

    setItemsPedido(prev => [...prev, nuevoItem]);
    setPedido({ cantidad: '', notas: '', hiloSeleccionado: null, modeloSeleccionado: null, materialSeleccionado: null });
    setMensaje('✅ Ítem agregado al pedido.');
  };

  const guardarPedidoCompleto = async () => {
    if (itemsPedido.length === 0) {
      setMensaje('❌ Agrega al menos un ítem antes de guardar el pedido.');
      return;
    }

    try {
      const res = await fetch('https://dcasa.onrender.com/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPedido })
      });

      if (!res.ok) throw new Error((await res.json()).mensaje || 'Error al guardar pedido');

      const data = await res.json();
      setMensaje(`✅ Pedido #${data.numeroPedido} guardado con éxito.`);
      setItemsPedido([]);
      setPedido({ cantidad: '', notas: '', hiloSeleccionado: null, modeloSeleccionado: null, materialSeleccionado: null });
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  const totalGeneral = itemsPedido.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="panel_derecho">
      {/* CARD FORMULARIO */}
      <div className="card-formulario">
        <form className="formulario" onSubmit={e => { e.preventDefault(); agregarItemAlPedido(); }}>
          <h2>Nuevo Pedido</h2>
          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={pedido.cantidad} onChange={handleChange} required className="input-cantidad" />

          <label>Hilo:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('hilo')}>
            {pedido.hiloSeleccionado ? `✅ ${pedido.hiloSeleccionado.color} ${pedido.hiloSeleccionado.codigo} (${pedido.hiloSeleccionado.marca})` : 'Seleccionar hilo'}
          </button>

          <label>Modelo:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('modelo')}>
            {pedido.modeloSeleccionado ? `✅ ${pedido.modeloSeleccionado.nombre_modelo} - $${pedido.modeloSeleccionado.precio}` : 'Seleccionar modelo'}
          </button>

          <label>Material:</label>
          <button type="button" className="boton-seleccion" onClick={() => setMostrarPanel('material')}>
            {pedido.materialSeleccionado ? `✅ ${pedido.materialSeleccionado.nombre_material}` : 'Seleccionar material'}
          </button>

          <label>Notas:</label>
          <textarea name="notas" value={pedido.notas} onChange={handleChange} className="textarea-notas" />

          <button type="submit">Agregar al pedido</button>
          <button type="button" onClick={guardarPedidoCompleto}>Guardar Pedido Completo</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>

      {/* CARD ITEMS DEL PEDIDO */}
      {itemsPedido.length > 0 && (
        <div className="card-panel">
          <h2>🧾 Items del Pedido</h2>
          <div className="items-grid">
            {itemsPedido.map((item, index) => (
              <div key={index} className="item-box">
                <p><strong>{item.cantidad}x</strong> {item.modelo} - {item.material}</p>
                <p>Hilo: {item.colorHilo} ({item.codigoHilo}) - {item.marcaHilo}</p>
                <p>Precio/U: ${item.precioUnitario.toFixed(2)} | Total: ${item.total.toFixed(2)}</p>
                {item.notas && <p className="item-box-nota">📝 {item.notas}</p>}
              </div>
            ))}
          </div>
          <p className="total-general">💵 Total del Pedido: <strong>${totalGeneral.toFixed(2)}</strong></p>
        </div>
      )}

      {/* CARD PANEL DE SELECCIÓN */}
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
                    <p>${modelo.precio}</p>
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
    </div>
  );
};

export default NuevoPedido;
