// src/App.jsx
import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';

// Importación de Componentes y Vistas
import Login from './views/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Inicio from './views/Inicio/Inicio';

import './App.css';

export default function App() {
  const { currentUser, currentView } = useContext(AppContext);

  // Selector dinámico de pantallas
  const renderActiveView = () => {
    switch (currentView) {
      case 'INICIO':
        return <Inicio />;
      case 'RESERVAS':
        return <div style={{ color: '#0f172a', fontFamily: 'Arial' }}><h2>Módulo de Reservas</h2><p>Próximamente: Grilla horaria sincronizada por salas.</p></div>;
      case 'PAGOS':
        return <div style={{ color: '#0f172a', fontFamily: 'Arial' }}><h2>Módulo de Pagos</h2><p>Próximamente: Caja chica, señas y saldos pendientes.</p></div>;
      case 'FACTURACION':
        return <div style={{ color: '#0f172a', fontFamily: 'Arial' }}><h2>Módulo de Facturación</h2><p>Próximamente: Historial de comprobantes y cierres de caja.</p></div>;
      case 'INTEGRACION':
        return <div style={{ color: '#0f172a', fontFamily: 'Arial' }}><h2>Módulo de Integración</h2><p>Próximamente: Estado de conexión con Booknetic y Webhooks.</p></div>;
      case 'USUARIOS':
        return <div style={{ color: '#0f172a', fontFamily: 'Arial' }}><h2>Control de Personal</h2><p>Panel exclusivo de Analista para gestionar altas y permisos.</p></div>;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="app-container">
      {!currentUser ? (
        <Login />
      ) : (
        <>
          <Sidebar />
          <main className="main-content" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
            {renderActiveView()}
          </main>
        </>
      )}
    </div>
  );
}