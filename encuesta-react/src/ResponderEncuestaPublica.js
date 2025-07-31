import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResponderEncuestaDetalle.css';

function ResponderEncuestaPublica() {
  const { idEncuesta } = useParams();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar la encuesta al montar el componente
  useEffect(() => {
    const cargarEncuesta = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Validar que tenemos un ID de encuesta
        if (!idEncuesta) {
          throw new Error('No se proporcionó ID de encuesta');
        }

        // Obtener encuestas de localStorage con manejo de errores
        let encuestasGuardadas = [];
        try {
          const encuestasData = localStorage.getItem('encuestas');
          encuestasGuardadas = encuestasData ? JSON.parse(encuestasData) : [];
          if (!Array.isArray(encuestasGuardadas)) {
            throw new Error('Formato inválido de encuestas');
          }
        } catch (storageError) {
          console.error('Error al leer encuestas:', storageError);
          throw new Error('Error al cargar las encuestas');
        }

        // Buscar la encuesta con validación robusta
        const encuestaEncontrada = encuestasGuardadas.find(e => {
          if (!e || e.id === undefined || e.id === null) return false;
          return e.id.toString() === idEncuesta.toString();
        });

        if (!encuestaEncontrada) {
          throw new Error('La encuesta solicitada no existe o no está disponible');
        }

        // Validar estructura de la encuesta
        if (!encuestaEncontrada.preguntas || !Array.isArray(encuestaEncontrada.preguntas)) {
          throw new Error('La estructura de la encuesta es inválida');
        }

        // Validar cada pregunta
        const preguntasValidas = encuestaEncontrada.preguntas.every(p => 
          p.id !== undefined && 
          p.pregunta && 
          p.tipo && 
          (p.tipo === 'texto' || p.opciones === undefined || Array.isArray(p.opciones))
        );

        if (!preguntasValidas) {
          throw new Error('Algunas preguntas tienen formato inválido');
        }

        setEncuesta(encuestaEncontrada);
      } catch (err) {
        console.error('Error al cargar encuesta:', err);
        setError(err.message || 'Ocurrió un error al cargar la encuesta');
      } finally {
        setIsLoading(false);
      }
    };

    cargarEncuesta();
  }, [idEncuesta]);

  // Manejar cambios en respuestas de texto
  const handleChange = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  // Manejar selección de opción múltiple
  const handleOpcionMultiple = (preguntaId, opcion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: opcion
    }));
  };

  // Manejar casillas de verificación
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

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!encuesta) {
      setError('Encuesta no disponible');
      return;
    }

    try {
      // Validar preguntas requeridas
      const preguntasRequeridasNoRespondidas = encuesta.preguntas
        .filter(p => p.requerida && !respuestas[p.id])
        .map(p => p.pregunta);

      if (preguntasRequeridasNoRespondidas.length > 0) {
        setError(`Por favor responde las siguientes preguntas requeridas: ${preguntasRequeridasNoRespondidas.join(', ')}`);
        return;
      }

      // Obtener respuestas existentes
      let todasLasRespuestas = {};
      try {
        const respuestasData = localStorage.getItem('respuestas');
        todasLasRespuestas = respuestasData ? JSON.parse(respuestasData) : {};
      } catch (error) {
        console.error('Error al leer respuestas:', error);
        throw new Error('Error al cargar respuestas existentes');
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
        desdePublico: true
      });

      // Guardar en localStorage
      localStorage.setItem('respuestas', JSON.stringify(todasLasRespuestas));

      // Mostrar mensaje de éxito y redirigir
      setSuccessMessage('¡Gracias por responder nuestra encuesta!');
      setTimeout(() => {
        navigate('/', { 
          state: { 
            mensaje: '¡Gracias por responder nuestra encuesta!',
            tipo: 'success'
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      setError('Ocurrió un error al guardar tus respuestas. Por favor intenta nuevamente.');
    }
  };

  // Renderizar pregunta según su tipo
  const renderPregunta = (pregunta, index) => {
    if (!pregunta || !pregunta.tipo) return null;

    return (
      <div key={pregunta.id || index} className="bloque-pregunta">
        <label>
          {index + 1}. {pregunta.pregunta}
          {pregunta.requerida && <span className="requerido">*</span>}
        </label>
        
        {pregunta.tipo === 'opcion-multiple' && (
          <div className="opciones-respuesta">
            {pregunta.opciones?.map((opcion, i) => (
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
            {pregunta.opciones?.map((opcion, i) => (
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
    );
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="contenedor">
        <div className="cargando">
          <p>Cargando encuesta...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="contenedor">
        <div className="error-container">
          <h2>Error</h2>
          <p className="error-message">{error}</p>
          <button
            className="boton"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de éxito
  if (successMessage) {
    return (
      <div className="contenedor">
        <div className="success-container">
          <h2>¡Gracias!</h2>
          <p className="success-message">{successMessage}</p>
          <div className="success-icon">✓</div>
        </div>
      </div>
    );
  }

  // Renderizar el formulario de la encuesta
  return (
    <div className="contenedor">
      <div className="encuesta-header">
        <h2>{encuesta?.titulo || 'Encuesta'}</h2>
        <p className="encuesta-descripcion">
          Encuesta pública - No se requiere inicio de sesión
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="formulario-encuesta">
        {encuesta?.preguntas?.map((pregunta, index) => 
          renderPregunta(pregunta, index)
        )}

        <div className="acciones-formulario">
          <button type="submit" className="boton boton-enviar">
            Enviar Respuestas
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResponderEncuestaPublica;