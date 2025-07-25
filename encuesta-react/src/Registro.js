import React, { useState } from 'react';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Registro exitoso');

  };

  return (
    <div className="contenedor">
      <h2>Registro de Usuario</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          required
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
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
        <label>Confirmar contraseña:</label>
        <input
          type="password"
          required
          value={confirmar}
          onChange={e => setConfirmar(e.target.value)}
        />
        <button type="submit" className="boton">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registro;