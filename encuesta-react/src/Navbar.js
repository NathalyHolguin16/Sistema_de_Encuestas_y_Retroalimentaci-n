import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario' };
  
  const primeraLetra = usuario.nombre.charAt(0).toUpperCase();

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/inicio" className="logo">EncuestApp</Link>
      
      <div className="user-info">
        <span>Bienvenido, {usuario.nombre}</span>
        <div className="user-avatar">{primeraLetra}</div>
        <button className="boton-secundario" onClick={cerrarSesion}> {/* Corregido aquí */}
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;