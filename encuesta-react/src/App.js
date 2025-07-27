import React, { useState } from 'react';
import './App.css';
import Login from './login';
import Registro from './Registro';
import Resultados from './Resultados';

function CrearEncuesta() {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([
    { pregunta: '', respuesta: '', tipo: 'Opción múltiple' }
  ]);

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { pregunta: '', respuesta: '', tipo: 'Opción múltiple' }
    ]);
  };

  const handlePreguntaChange = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Encuesta guardada');
  };

  return (
    <div className="contenedor">
      <h2>Crear Nueva Encuesta</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Título de la encuesta:</label>
        <input
          type="text"
          required
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />

        <div id="contenedor-preguntas">
          {preguntas.map((p, i) => (
            <div className="preguntas" key={i}>
              <label>Pregunta {i + 1}:</label>
              <input
                type="text"
                required
                value={p.pregunta}
                onChange={e => handlePreguntaChange(i, 'pregunta', e.target.value)}
              />

              <label>Ingrese respuesta</label>
              <input
                type="text"
                required
                value={p.respuesta}
                onChange={e => handlePreguntaChange(i, 'respuesta', e.target.value)}
              />

              <label>Tipo de respuesta:</label>
              <select
                value={p.tipo}
                onChange={e => handlePreguntaChange(i, 'tipo', e.target.value)}
              >
                <option>Opción múltiple</option>
                <option>Respuesta corta</option>
                <option>Escala de satisfacción</option>
              </select>
            </div>
          ))}
        </div>
        <button type="button" className="boton" onClick={agregarPregunta}>
          Agregar Pregunta
        </button>
        <button type="submit" className="boton">
          Guardar Encuesta
        </button>
      </form>
    </div>
  );
}

function App() {
  const [vista, setVista] = useState('login'); // 'login', 'registro', 'encuesta'

  return (
    <div>
      <nav style={{textAlign: 'center', margin: '20px'}}>
        <button className="boton" onClick={() => setVista('login')}>Login</button>
        <button className="boton" onClick={() => setVista('registro')}>Registro</button>
        <button className="boton" onClick={() => setVista('encuesta')}>Crear Encuesta</button>
        <button className="boton" onClick={() => setVista('resultados')}>Resultados</button>
      </nav>
      {vista === 'login' && <Login />}
      {vista === 'registro' && <Registro />}
      {vista === 'encuesta' && <CrearEncuesta />}
      {vista === 'resultados' && <Resultados />}
    </div>
  );
}

export default App;
