
import React, { useState } from 'react';
import './Login.css'; // Archivo CSS para los estilos

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Acceso autorizado');
  };

  return (
    <div className="retro-login-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">SYSTEM LOGIN</div>
      </div>
      
      <form className="retro-form" onSubmit={handleSubmit}>
        <div className="input-field">
          <label className="glowing-label">
            <span className="label-text">USUARIO:</span>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="retro-input"
              autoComplete="off"
            />
          </label>
          <div className="input-underline"></div>
        </div>
        
        <div className="input-field">
          <label className="glowing-label">
            <span className="label-text">CONTRASEÑA:</span>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="retro-input"
            />
          </label>
          <div className="input-underline"></div>
        </div>
        
        <button type="submit" className="retro-button">
          <span className="button-text">INICIAR SESIÓN</span>
          <div className="button-glow"></div>
        </button>
      </form>
      
      <div className="scan-line"></div>
      <div className="grid-overlay"></div>
    </div>
  );
}

export default Login;