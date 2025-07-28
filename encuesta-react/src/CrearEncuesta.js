import React, { useState } from 'react';

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

  const guardarEncuesta = (e) => {
    e.preventDefault();

    // Validación simple
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    // Aquí podrías guardar en localStorage o enviarlo a un backend
    console.log({ titulo, preguntas });
    alert('Encuesta guardada correctamente ✅');

    // Reiniciar si quieres:
    setTitulo('');
    setPreguntas([{ pregunta: '', respuesta: '', tipo: 'Opción múltiple' }]);
  };

  return (
    <div className="contenedor">
      <h2>Crear Nueva Encuesta</h2>
      <br />
      <form className="formulario" onSubmit={guardarEncuesta}>
        <label>Título de la encuesta:</label>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />

        <div id="contenedor-preguntas">
          {preguntas.map((p, i) => (
            <div className="preguntas" key={i}>
              <label>Pregunta {i + 1}:</label>
              <input
                type="text"
                value={p.pregunta}
                onChange={e => handlePreguntaChange(i, 'pregunta', e.target.value)}
                required
              />

              <label>Ingrese respuesta</label>
              <input
                type="text"
                value={p.respuesta}
                onChange={e => handlePreguntaChange(i, 'respuesta', e.target.value)}
                required
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

        <br />
        <button type="button" className="boton" onClick={agregarPregunta}>
          Agregar Pregunta
        </button>
        <br /><br />
        <button type="submit" className="boton">
          Guardar Encuesta
        </button>
      </form>
    </div>
  );
}

export default CrearEncuesta;

