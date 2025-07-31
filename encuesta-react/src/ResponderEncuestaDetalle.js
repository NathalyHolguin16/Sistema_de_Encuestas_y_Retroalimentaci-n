import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResponderEncuestaDetalle.css';

function ResponderEncuestaDetalle() {
  const { state } = useLocation();
  const { encuesta } = state || {};
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});

  if (!encuesta) {
    navigate('/responder');
    return null;
  }

  const handleChange = (preguntaId, valor) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: valor
    });
  };

  const handleOpcionMultiple = (preguntaId, opcion) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: opcion
    });
  };

  const handleCheckbox = (preguntaId, opcion, isChecked) => {
    const current = respuestas[preguntaId] || [];
    let nuevasRespuestas;
    
    if (isChecked) {
      nuevasRespuestas = [...current, opcion];
    } else {
      nuevasRespuestas = current.filter(item => item !== opcion);
    }

    setRespuestas({
      ...respuestas,
      [preguntaId]: nuevasRespuestas
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar preguntas requeridas
    for (const pregunta of encuesta.preguntas) {
      if (pregunta.requerida && !respuestas[pregunta.id]) {
        alert(`La pregunta "${pregunta.pregunta}" es requerida`);
        return;
      }
    }

    // Obtener respuestas existentes con manejo de errores
    let todasLasRespuestas = {};
    try {
      const respuestasData = localStorage.getItem('respuestas');
      
      // Verificar si hay datos y si son válidos
      if (respuestasData) {
        // Si los datos son un objeto (no debería pasar), usarlos directamente
        if (typeof respuestasData === 'object') {
          todasLasRespuestas = respuestasData;
        } else {
          // Si es una cadena, intentar parsearla
          todasLasRespuestas = JSON.parse(respuestasData);
        }
      }
    } catch (error) {
      console.error('Error al leer respuestas:', error);
      // Si hay error de parseo, inicializar como objeto vacío
      todasLasRespuestas = {};
    }

    // Crear estructura para esta encuesta si no existe
    if (!todasLasRespuestas[encuesta.id]) {
      todasLasRespuestas[encuesta.id] = {
        titulo: encuesta.titulo,
        respuestas: []
      };
    }

    // Agregar nueva respuesta
    todasLasRespuestas[encuesta.id].respuestas.push({
      ...respuestas,
      fecha: new Date().toISOString(),
      desdePublico: false // Marcamos como respuesta privada
    });

    // Guardar en localStorage con manejo de errores
    try {
      localStorage.setItem('respuestas', JSON.stringify(todasLasRespuestas));
      alert('¡Gracias por responder la encuesta!');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      alert('Ocurrió un error al guardar tus respuestas. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="contenedor">
      <h2>{encuesta.titulo}</h2>
      <form onSubmit={handleSubmit}>
        {encuesta.preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bloque-pregunta">
            <label>
              {pregunta.pregunta}
              {pregunta.requerida && <span className="requerido"> *</span>}
            </label>
            
            {pregunta.tipo === 'opcion-multiple' && (
              <div className="opciones-respuesta">
                {pregunta.opciones.map((opcion, i) => (
                  <div key={i} className="opcion-respuesta">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      id={`opcion-${pregunta.id}-${i}`}
                      onChange={() => handleOpcionMultiple(pregunta.id, opcion)}
                      required={pregunta.requerida}
                    />
                    <label htmlFor={`opcion-${pregunta.id}-${i}`}>{opcion}</label>
                  </div>
                ))}
              </div>
            )}

            {pregunta.tipo === 'casillas' && (
              <div className="opciones-respuesta">
                {pregunta.opciones.map((opcion, i) => (
                  <div key={i} className="opcion-respuesta">
                    <input
                      type="checkbox"
                      id={`opcion-${pregunta.id}-${i}`}
                      onChange={(e) => handleCheckbox(pregunta.id, opcion, e.target.checked)}
                    />
                    <label htmlFor={`opcion-${pregunta.id}-${i}`}>{opcion}</label>
                  </div>
                ))}
              </div>
            )}

            {pregunta.tipo === 'respuesta-corta' && (
              <input
                type="text"
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                required={pregunta.requerida}
                className="input-respuesta"
              />
            )}

            {pregunta.tipo === 'parrafo' && (
              <textarea
                rows={4}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                required={pregunta.requerida}
                className="textarea-respuesta"
              />
            )}

            {pregunta.tipo === 'escala' && (
              <div className="escala-respuesta">
                <div className="escala-puntos">
                  {[1, 2, 3, 4, 5].map((punto) => (
                    <div key={punto} className="punto-escala">
                      <input
                        type="radio"
                        name={`escala-${pregunta.id}`}
                        id={`punto-${pregunta.id}-${punto}`}
                        onChange={() => handleChange(pregunta.id, punto)}
                        required={pregunta.requerida}
                      />
                      <label htmlFor={`punto-${pregunta.id}-${punto}`}>{punto}</label>
                    </div>
                  ))}
                </div>
                <div className="escala-labels">
                  <span>1 (Malo)</span>
                  <span>5 (Excelente)</span>
                </div>
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="boton-enviar">
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
}

export default ResponderEncuestaDetalle;