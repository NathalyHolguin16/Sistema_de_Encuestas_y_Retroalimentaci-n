import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inicio de sesión realizado');
  };

  return (
    <div className="contenedor">
      <h2>Iniciar Sesión</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label>Contraseña:</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="boton">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;