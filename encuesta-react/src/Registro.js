// src/Registro.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validarRegistro = (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Guardar usuario
    const usuario = {
      nombre,
      email
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert("Registro exitoso ✅");
    navigate('/inicio');
  };

  return (
    <div className="contenedor">
      <h2>Registro de Usuario</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="formulario" onSubmit={validarRegistro}>
        <div className="input-group">
          <label htmlFor="nombre">Nombre completo:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="input-field"
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
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
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmar">Confirmar contraseña:</label>
          <input
            type="password"
            id="confirmar"
            name="confirmar"
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)}
            required
            className="input-field"
            placeholder="Repite tu contraseña"
          />
        </div>

        <button type="submit" className="boton">REGISTRARSE</button>
      </form>

      <p className="enlace">
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

export default Registro;
