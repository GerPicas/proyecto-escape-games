// src/views/Login.jsx
import React, { useState } from 'react';
import './Login.css'; // Importamos el archivo de estilos separado

export default function Login({ users, setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validamos si las credenciales coinciden con algún usuario de nuestra simulación viva
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Seteamos el usuario en el estado global de App.jsx y cambia de pantalla solo
      setCurrentUser(foundUser);
    } else {
      setError('Credenciales incorrectas. Intentá de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Escape Room</h2>
        <p className="login-subtitle">Sistema de Gestión Interna</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@escaperoom.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Ingresar al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}