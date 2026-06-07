// src/App.jsx
import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';

// Importación de Componentes y Vistas
import Login from './views/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';

import './App.css';

export default function App() {
  const { currentUser, currentView } = useContext(AppContext);

  // Función interna para decidir qué pantalla mostrar a la derecha del Sidebar
  const renderActiveView = () => {
    switch (currentView) {
      case 'INICIO':
        return <div style={{ color: '#0f172a' }}><h2>Pantalla de Inicio</h2><p>Acá irá el calendario y la grilla horaria.</p></div>;
      case 'RESERVAS':
        return <div style={{ color: '#0f172a' }}><h2>Pantalla de Reservas</h2><p>Acá irá la tabla y modales de clientes.</p></div>;
      case 'PAGOS':
        return <div style={{ color: '#0f172a' }}><h2>Pantalla de Pagos</h2><p>Acá irán las cajas, KPIs financieros y transacciones.</p></div>;
      case 'USUARIOS':
        return <div style={{ color: '#0f172a' }}><h2>Pantalla de Usuarios</h2><p>Panel exclusivo del Analista para dar de alta accesos.</p></div>;
      default:
        return <div style={{ color: '#0f172a' }}><h2>Pantalla de Inicio</h2></div>;
    }
  };

  return (
    <div className="app-container">
      {!currentUser ? (
        <Login />
      ) : (
        <>
          {/* Menu Lateral Fijo */}
          <Sidebar />
          
          {/* Contenedor de la pantalla seleccionada */}
          <main className="main-content" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
            {renderActiveView()}
          </main>
        </>
      )}
    </div>
  );
}