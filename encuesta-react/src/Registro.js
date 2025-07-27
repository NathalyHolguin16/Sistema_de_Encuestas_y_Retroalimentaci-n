import React from 'react';


function Registro() {
  const validarRegistro = (e) => {
    e.preventDefault(); // evita recargar la página

    // Aquí podrías agregar validaciones personalizadas si las tenías en script.js
    console.log("Formulario de registro enviado.");
  };

  return (
    <div className="contenedor">
      <h2>Registro de Usuario</h2>

      <form id="form-registro" onSubmit={validarRegistro}>
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required />
        <br />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br />

        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />
        <br />

        <label htmlFor="confirmar">Confirmar contraseña:</label>
        <input type="password" id="confirmar" name="confirmar" required />
        <br />

        <button type="submit" className="boton">REGISTRARSE</button>
      </form>
    </div>
  );
}

export default Registro;

