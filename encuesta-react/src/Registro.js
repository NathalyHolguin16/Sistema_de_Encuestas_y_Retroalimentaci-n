import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Importar hook para redirigir

function Registro() {
  const navigate = useNavigate(); // ✅ inicializar navegación

  const validarRegistro = (e) => {
    e.preventDefault();

    const form = e.target;
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmar = form.confirmar.value;

    // Validación adicional: confirmar contraseña
    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Aquí podrías guardar datos o hacer fetch a backend...

    alert("Registro exitoso ✅");
    navigate('/'); // ✅ Redirigir al Login (ruta "/")
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

