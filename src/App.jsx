// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initialUsers } from './data/mockData';

// Importación del Login
import Login from './views/Login/Login';

// Importación de los estilos separados
import './App.css';

export default function App() {
  // --- 1. ESTADO DE USUARIOS (Con persistencia en LocalStorage) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('er_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // --- 2. ESTADO DE CONTROL DE AUTENTICACIÓN ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('er_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- 3. EFECTOS PARA GUARDAR EN LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('er_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('er_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('er_current_user');
    }
  }, [currentUser]);

  // --- 4. RENDERIZADO ---
  return (
    <div className="app-container">
      {!currentUser ? (
        <Login users={users} setCurrentUser={setCurrentUser} />
      ) : (
        <main className="main-content">
          {/* Botón discreto para cerrar sesión en la esquina superior derecha */}
          <button 
            onClick={() => setCurrentUser(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Cerrar Sesión
          </button>
        </main>
      )}
    </div>
  );
}