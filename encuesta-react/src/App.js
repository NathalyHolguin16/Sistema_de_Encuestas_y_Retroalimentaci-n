import React, { useState } from 'react';
import './App.css';

function App() {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([
    { pregunta: '', respuesta: '', tipo: 'Opción múltiple' }
  ]);

  // Agregar nueva pregunta
  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { pregunta: '', respuesta: '', tipo: 'Opción múltiple' }
    ]);
  };

  // Manejar cambios en las preguntas
  const handlePreguntaChange = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  // Guardar encuesta
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer lo que quieras con los datos
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

export default App;
