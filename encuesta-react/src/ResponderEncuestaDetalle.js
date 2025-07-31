import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResponderEncuestaDetalle.css';

function ResponderEncuestaDetalle() {
  const { state } = useLocation();
  const { encuesta } = state || {};
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!encuesta) {
      navigate('/responder');
    }
  }, [encuesta, navigate]);

  const handleChange = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  const handleOpcionMultiple = (preguntaId, opcion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: opcion
    }));
  };

  const handleCheckbox = (preguntaId, opcion, isChecked) => {
    setRespuestas(prev => {
      const current = prev[preguntaId] || [];
      let nuevasRespuestas;
      
      if (isChecked) {
        nuevasRespuestas = [...current, opcion];
      } else {
        nuevasRespuestas = current.filter(item => item !== opcion);
      }

      return {
        ...prev,
        [preguntaId]: nuevasRespuestas
      };
    });
  };

  const validarRespuesta = (pregunta) => {
    const respuesta = respuestas[pregunta.id];
    
    if (!pregunta.requerida) return true;
    
    if (pregunta.tipo === 'casillas') {
      return Array.isArray(respuesta) && respuesta.length > 0;
    }
    
    return respuesta !== undefined && respuesta !== null && respuesta !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validar todas las preguntas requeridas
    const preguntasNoRespondidas = encuesta.preguntas
      .filter(p => p.requerida && !validarRespuesta(p))
      .map(p => p.pregunta);

    if (preguntasNoRespondidas.length > 0) {
      setError(`Por favor responde las siguientes preguntas requeridas: ${preguntasNoRespondidas.join(', ')}`);
      return;
    }

    try {
      // Obtener respuestas existentes
      const todasLasRespuestas = JSON.parse(localStorage.getItem('respuestas') || '{}');

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
        desdePublico: false
      });

      // Guardar en localStorage
      localStorage.setItem('respuestas', JSON.stringify(todasLasRespuestas));

      // Redirigir con mensaje de éxito
      navigate('/inicio', { 
        state: { 
          mensaje: '¡Gracias por responder la encuesta!', 
          tipo: 'success' 
        } 
      });
    } catch (err) {
      console.error('Error al guardar respuestas:', err);
      setError('Ocurrió un error al guardar tus respuestas. Por favor intenta nuevamente.');
    }
  };

  if (!encuesta) {
    return null;
  }

  return (
    <div className="contenedor">
      <h2>{encuesta.titulo}</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {encuesta.preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bloque-pregunta">
            <label>
              {index + 1}. {pregunta.pregunta}
              {pregunta.requerida && <span style={{ color: 'red' }}> *</span>}
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
                      checked={respuestas[pregunta.id] === opcion}
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
                      checked={respuestas[pregunta.id]?.includes(opcion) || false}
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
                value={respuestas[pregunta.id] || ''}
                required={pregunta.requerida}
                className="input-respuesta"
              />
            )}

            {pregunta.tipo === 'parrafo' && (
              <textarea
                rows={4}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                value={respuestas[pregunta.id] || ''}
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
                        checked={respuestas[pregunta.id] === punto}
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

        <button type="submit" className="boton boton-enviar">
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
}

export default ResponderEncuestaDetalle;