import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './login';
import Registro from './Registro';
import Inicio from './Inicio';
import CrearEncuesta from './CrearEncuesta';
import ResponderEncuesta from './ResponderEncuesta';


function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Crear" element={<CrearEncuesta />} />
        <Route path="/Responder" element={<ResponderEncuesta/>} />
      </Routes>
    
    
  );
}

export default App;

