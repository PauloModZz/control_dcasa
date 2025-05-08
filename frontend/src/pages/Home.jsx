import React, { Suspense, lazy, useState } from 'react';
import './styles/home.css';
import Loader from './styles/loader.jsx';

const VerPedidos = lazy(() => import('./secciones/ver_pedidos'));
const NuevoPedido = lazy(() => import('./secciones/nuevo_pedido'));
const AgregarItems = lazy(() => import('./secciones/agregar_items'));
const Contabilidad = lazy(() => import('./secciones/contabilidad'));
const VerHilos = lazy(() => import('./secciones/ver_hilos'));
const VerModelos = lazy(() => import('./secciones/ver_modelos'));
// VerMaterial importado pero sin botón en el menú
const VerMaterial = lazy(() => import('./secciones/ver_material'));

const Home = () => {
  const [seccion, setSeccion] = useState('ver_pedidos');

  const renderSeccion = () => {
    switch (seccion) {
      case 'ver_pedidos': return <VerPedidos />;
      case 'nuevo_pedido': return <NuevoPedido />;
      case 'agregar_items': return <AgregarItems />;
      case 'contabilidad': return <Contabilidad />;
      case 'ver_hilos': return <VerHilos />;
      case 'ver_modelos': return <VerModelos />;
      case 'ver_material': return <VerMaterial />; // Se puede usar internamente si quieres
      default: return <h2>Sección no encontrada</h2>;
    }
  };

  return ( 
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">D' Casa</h2>
        <button className={seccion === 'ver_pedidos' ? 'activo' : ''} onClick={() => setSeccion('ver_pedidos')}>📦 Ver pedidos</button>
        <button className={seccion === 'nuevo_pedido' ? 'activo' : ''} onClick={() => setSeccion('nuevo_pedido')}>➕ Nuevo pedido</button>
        <button className={seccion === 'agregar_items' ? 'activo' : ''} onClick={() => setSeccion('agregar_items')}>📋 Agregar ítems</button>
        <button className={seccion === 'contabilidad' ? 'activo' : ''} onClick={() => setSeccion('contabilidad')}>💰 Contabilidad</button>
        <button className={seccion === 'ver_hilos' ? 'activo' : ''} onClick={() => setSeccion('ver_hilos')}>🧵 Ver hilos</button>
        <button className={seccion === 'ver_modelos' ? 'activo' : ''} onClick={() => setSeccion('ver_modelos')}>👗 Ver modelos</button>
      </aside>

      <main className="main-content">
        <Suspense fallback={
          <div className="loader-container">
            <Loader />
          </div>
        }>
          {renderSeccion()}
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
