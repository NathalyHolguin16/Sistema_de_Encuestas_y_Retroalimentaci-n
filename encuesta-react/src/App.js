import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Registro from './Registro';
import Inicio from './Inicio';

function CrearEncuesta() {
  return (
    <div className="contenedor">
      <h2>Crear Nueva Encuesta</h2>
      {/* contenido omitido por brevedad */}
    </div>
  );
}

function App() {
  return (
    <div>
      <nav style={{ textAlign: 'center', margin: '20px' }}>
        <Link to="/" className="boton">Login</Link>
        <Link to="/registro" className="boton">Registro</Link>
        <Link to="/encuesta" className="boton">Crear Encuesta</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/encuesta" element={<CrearEncuesta />} />
      </Routes>
    </div>
  );
}

export default App;

