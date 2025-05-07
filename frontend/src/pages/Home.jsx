// Home.js
import React, { Suspense, lazy, useState } from 'react';
import './styles/home.css';

// Componentes externos
const VerPedidos = lazy(() => import('./secciones/ver_pedidos'));
const NuevoPedido = lazy(() => import('./secciones/nuevo_pedido'));
const AgregarItems = lazy(() => import('./secciones/agregar_items'));
const Contabilidad = lazy(() => import('./secciones/contabilidad'));
const VerHilos = lazy(() => import('./secciones/ver_hilos'));
const VerModelos = lazy(() => import('./secciones/ver_modelos')); // NUEVO: componente para ver modelos

const Home = () => {
  const [seccion, setSeccion] = useState('ver_pedidos');

  const renderSeccion = () => {
    switch (seccion) {
      case 'ver_pedidos':
        return <VerPedidos />;
      case 'nuevo_pedido':
        return <NuevoPedido />;
      case 'agregar_items':
        return <AgregarItems />;
      case 'contabilidad':
        return <Contabilidad />;
      case 'informacion':
        return <h2>Sección Información en desarrollo</h2>;
      case 'ver_hilos':
        return <VerHilos />;
      case 'ver_modelos':
        return <VerModelos />; // CAMBIADO: ahora muestra el componente real
      case 'ver_telas':
        return <h2>Sección Ver telas en desarrollo</h2>;
      default:
        return <h2>Sección no encontrada</h2>;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">D' Casa</h2>
        <button onClick={() => setSeccion('ver_pedidos')}>📦 Ver pedidos</button>
        <button onClick={() => setSeccion('nuevo_pedido')}>➕ Nuevo pedido</button>
        <button onClick={() => setSeccion('agregar_items')}>📋 Agregar ítems</button>
        <button onClick={() => setSeccion('contabilidad')}>💰 Contabilidad</button>
        <button onClick={() => setSeccion('informacion')}>ℹ️ Información</button>
        <button onClick={() => setSeccion('ver_hilos')}>🧵 Ver hilos</button>
        <button onClick={() => setSeccion('ver_modelos')}>👗 Ver modelos</button>
        <button onClick={() => setSeccion('ver_telas')}>🧶 Ver telas</button>
      </aside>

      <main className="main-content">
        <Suspense fallback={<p>Cargando...</p>}>
          {renderSeccion()}
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
