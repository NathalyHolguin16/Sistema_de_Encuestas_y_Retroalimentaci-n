import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './VerResultados.css';

// Registrar componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VerResultados() {
  const [encuestas, setEncuestas] = useState([]);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState('');
  const [resultados, setResultados] = useState([]);

  // Cargar encuestas al iniciar
  useEffect(() => {
    try {
      const encuestasData = localStorage.getItem('encuestas');
      const encuestasParseadas = encuestasData ? JSON.parse(encuestasData) : [];
      setEncuestas(encuestasParseadas);
      
      if (encuestasParseadas.length > 0) {
        setEncuestaSeleccionada(encuestasParseadas[0].titulo);
      }
    } catch (error) {
      console.error("Error cargando encuestas:", error);
    }
  }, []);

  // Procesar resultados cuando cambia la encuesta seleccionada
  useEffect(() => {
    if (!encuestaSeleccionada || encuestas.length === 0) return;
    
    try {
      const respuestasData = localStorage.getItem('respuestas');
      const todasRespuestas = respuestasData ? JSON.parse(respuestasData) : {};
      const respuestasEncuesta = todasRespuestas[encuestaSeleccionada] || {};
      
      const encuestaCompleta = encuestas.find(e => e.titulo === encuestaSeleccionada);
      if (!encuestaCompleta) return;

      const resultadosProcesados = encuestaCompleta.preguntas.map(pregunta => {
        const respuesta = respuestasEncuesta[pregunta.id];
        
        // Para preguntas de texto
        if (pregunta.tipo === 'texto' || pregunta.tipo === 'parrafo') {
          return {
            tipo: 'texto',
            pregunta: pregunta.pregunta,
            respuesta: respuesta || "Sin respuesta"
          };
        }
        
        // Para opción múltiple
        if (pregunta.tipo === 'opcion-multiple') {
          const conteo = {};
          
          // Contar respuestas para cada opción
          pregunta.opciones.forEach(opcion => {
            conteo[opcion] = opcion === respuesta ? 1 : 0;
          });
          
          return {
            tipo: 'grafico',
            pregunta: pregunta.pregunta,
            datos: {
              etiquetas: Object.keys(conteo),
              valores: Object.values(conteo)
            }
          };
        }
        
        return {
          tipo: 'desconocido',
          pregunta: pregunta.pregunta,
          mensaje: `Tipo de pregunta no soportado: ${pregunta.tipo}`
        };
      });
      
      setResultados(resultadosProcesados);
    } catch (error) {
      console.error("Error procesando resultados:", error);
    }
  }, [encuestaSeleccionada, encuestas]);

  if (encuestas.length === 0) {
    return (
      <div className="contenedor">
        <h1>Resultados de Encuestas</h1>
        <p>No hay encuestas disponibles</p>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <h1>Resultados de Encuestas</h1>
      
      <div className="selector-encuesta">
        <label>Seleccionar encuesta: </label>
        <select
          value={encuestaSeleccionada}
          onChange={(e) => setEncuestaSeleccionada(e.target.value)}
        >
          {encuestas.map((encuesta, index) => (
            <option key={index} value={encuesta.titulo}>
              {encuesta.titulo}
            </option>
          ))}
        </select>
      </div>
      
      <div className="resultados-lista">
        {resultados.map((resultado, index) => (
          <div key={index} className="resultado-item">
            <h3>{resultado.pregunta}</h3>
            
            {/* Mostrar respuesta de texto */}
            {resultado.tipo === 'texto' && (
              <div className="respuesta-texto">
                <p>{resultado.respuesta}</p>
              </div>
            )}
            
            {/* Mostrar gráfico para opción múltiple */}
            {resultado.tipo === 'grafico' && (
              <div className="grafico-container">
                <Bar
                  data={{
                    labels: resultado.datos.etiquetas,
                    datasets: [{
                      label: 'Respuestas',
                      data: resultado.datos.valores,
                      backgroundColor: 'rgba(54, 162, 235, 0.7)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
            
            {/* Mensaje para tipos no soportados */}
            {resultado.tipo === 'desconocido' && (
              <p className="tipo-no-soportado">{resultado.mensaje}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerResultados;