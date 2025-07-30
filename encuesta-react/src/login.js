
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simular validación exitosa
    const usuario = {
      nombre: email.split('@')[0],
      email
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    navigate('/inicio');
  };

  return (
    <div className="contenedor">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form className="formulario" onSubmit={manejarLogin}>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="tu@email.com"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <button type="submit" className="boton">ACCESO</button>
      </form>

      <p className="enlace">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default Login;

