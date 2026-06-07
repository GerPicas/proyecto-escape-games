// src/components/sidebar/Sidebar.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
  const { currentView, setCurrentView, currentUser, logout } = useContext(AppContext);

  if (!currentUser) return null;

  // Obtenemos la inicial del usuario para el avatar
  const inicial = currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-brand">Escape Room</h3>
      </div>

      <nav className="sidebar-nav">
        <button 
          onClick={() => setCurrentView('INICIO')}
          className={`sidebar-link ${currentView === 'INICIO' ? 'active' : ''}`}
        >
          📊 Inicio
        </button>

        <button 
          onClick={() => setCurrentView('RESERVAS')}
          className={`sidebar-link ${currentView === 'RESERVAS' ? 'active' : ''}`}
        >
          📅 Reservas
        </button>

        <button 
          onClick={() => setCurrentView('PAGOS')}
          className={`sidebar-link ${currentView === 'PAGOS' ? 'active' : ''}`}
        >
          💳 Pagos
        </button>

        {currentUser.rol === 'ANALISTA' && (
          <button 
            onClick={() => setCurrentView('USUARIOS')}
            className={`sidebar-link ${currentView === 'USUARIOS' ? 'active' : ''}`}
          >
            👥 Usuarios
          </button>
        )}
      </nav>

      {/* Footer del perfil calcado al prototipo */}
      <div className="sidebar-footer">
        <div className="sidebar-profile-card">
          <div className="sidebar-avatar">
            {inicial}
          </div>
          <div className="sidebar-profile-info">
            <p className="sidebar-profile-name">{currentUser.nombre}</p>
            <p className="sidebar-profile-email">{currentUser.email}</p>
          </div>
        </div>
        
        <button onClick={logout} className="sidebar-logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}