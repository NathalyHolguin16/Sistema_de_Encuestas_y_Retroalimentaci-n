import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ para redirigir

function Login() {
  const navigate = useNavigate();

  const validarLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    // Simulación de validación básica
    if (email === "" || password === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Aquí podrías verificar contra datos reales (localStorage, API...)
    alert("Login exitoso ✅");
    navigate('/inicio'); // ✅ redirige a la pantalla de inicio
  };

  return (
    <div className="contenedor">
      <h2>🔐 Iniciar Sesión</h2>

      <form id="form-login" className="formulario" onSubmit={validarLogin}>
        <label htmlFor="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" required />
        <br /><br />

        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />
        <br /><br />

        <button type="submit" className="boton">LOGIN</button>
      </form>

      <br /><br />

      <p className="enlace">
        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;

