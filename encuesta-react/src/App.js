import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Login from './login';
import Registro from './Registro';
import Inicio from './Inicio';
import CrearEncuesta from './CrearEncuesta';
import ResponderEncuesta from './ResponderEncuesta';
import ResponderEncuestaDetalle from './ResponderEncuestaDetalle';
import VerResultados from './VerResultados';
import Navbar from './Navbar';
import ResponderEncuestaPublica from './ResponderEncuestaPublica';

function App() {
  const location = useLocation();
  const showNavbar = !['/', '/registro'].includes(location.pathname) && 
                     !location.pathname.startsWith('/responder/');
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/crear" element={<CrearEncuesta />} />
        <Route path="/responder" element={<ResponderEncuesta />} />
        <Route path="/responder/:idEncuesta" element={<ResponderEncuestaPublica />} />
        <Route path="/responder-encuesta-detalle" element={<ResponderEncuestaDetalle />} />
        <Route path="/resultados" element={<VerResultados />} />
      </Routes>
    </>
  );
}

export default App;
