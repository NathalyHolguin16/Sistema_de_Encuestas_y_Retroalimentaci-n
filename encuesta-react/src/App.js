import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './login';
import Registro from './Registro';
import Inicio from './Inicio';
import CrearEncuesta from './CrearEncuesta';
import ResponderEncuesta from './ResponderEncuesta';
import ResponderEncuestaDetalle from './ResponderEncuestaDetalle';
import VerResultados from './VerResultados';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/crear" element={<CrearEncuesta />} />
      <Route path="/responder" element={<ResponderEncuesta />} />
      <Route path="/responder-encuesta-detalle" element={<ResponderEncuestaDetalle />} />
      <Route path="/resultados" element={<VerResultados />} />   
       </Routes>
  );
}

export default App;
