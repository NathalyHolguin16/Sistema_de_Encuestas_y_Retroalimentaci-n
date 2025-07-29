import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ResponderEncuesta() {
  const [encuestasDisponibles, setEncuestasDisponibles] = useState([]);
  const navigate = useNavigate();

  // Cargar encuestas al montar el componente
  useEffect(() => {
    const encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    setEncuestasDisponibles(encuestasGuardadas);
  }, []);

  const responderEncuesta = (encuesta) => {
    navigate('/responder-encuesta-detalle', { state: { encuesta } });
  };

  return (
    <div className="contenedor">
      <h1>Encuestas Disponibles</h1>
      <br />
      {encuestasDisponibles.length === 0 ? (
        <p>No hay encuestas disponibles para responder.</p>
      ) : (
        <div className="tarjetas-opciones2">
          {encuestasDisponibles.map((encuesta, index) => (
            <div className="tarjeta" key={index}>
              <h3>{encuesta.titulo}</h3>
              <p>{encuesta.preguntas.length} preguntas</p>
              <p>Creada el: {new Date(encuesta.fecha).toLocaleDateString()}</p>
              <br />
              <button 
                className="boton" 
                onClick={() => responderEncuesta(encuesta)}
              >
                Responder Encuesta
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResponderEncuesta;
