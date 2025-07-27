import React from 'react';


function Login() {
  return (
    <div className="contenedor">
      <h2>🔐 Iniciar Sesión</h2>

      <form id="form-login" className="formulario">
        <label htmlFor="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" required />

        <br />
        <br />

        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />

        <br />
        <br />

        <button type="submit" className="boton">LOGIN</button>
      </form>

      <br />
      <br />

      <p className="enlace">
        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;

