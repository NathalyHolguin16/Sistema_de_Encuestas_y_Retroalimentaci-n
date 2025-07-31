import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import './VerResultados.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function VerResultados() {
  const [encuestas, setEncuestas] = useState([]);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipoGrafico, setTipoGrafico] = useState('barra');
  const [error, setError] = useState('');
  const [tipoRespuestas, setTipoRespuestas] = useState('todas');

  // Cargar encuestas al montar el componente
  useEffect(() => {
    const cargarEncuestas = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Obtener datos de localStorage
        const encuestasData = localStorage.getItem('encuestas');
        const encuestasParseadas = encuestasData ? JSON.parse(encuestasData) : [];
        
        // Validar estructura de datos
        if (!Array.isArray(encuestasParseadas)) {
          throw new Error('El formato de las encuestas no es válido');
        }

        // Filtrar encuestas con estructura correcta
        const encuestasValidas = encuestasParseadas.filter(encuesta => 
          encuesta && 
          encuesta.id !== undefined && 
          encuesta.id !== null && 
          encuesta.titulo && 
          Array.isArray(encuesta.preguntas)
        );

        setEncuestas(encuestasValidas);
        
        // Seleccionar primera encuesta válida
        if (encuestasValidas.length > 0) {
          setEncuestaSeleccionada(encuestasValidas[0].id);
        } else {
          setError('No hay encuestas válidas disponibles');
        }
      } catch (err) {
        console.error("Error cargando encuestas:", err);
        setError('Error al cargar las encuestas. Por favor recarga la página.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarEncuestas();
  }, []);

  // Procesar resultados cuando cambian los filtros
  useEffect(() => {
    if (!encuestaSeleccionada || encuestas.length === 0) return;
    
    const procesarResultados = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Obtener respuestas de localStorage
        const respuestasData = localStorage.getItem('respuestas');
        let todasRespuestas = {};
        
        try {
          todasRespuestas = respuestasData ? JSON.parse(respuestasData) : {};
        } catch (error) {
          console.error('Error al parsear respuestas:', error);
          todasRespuestas = {};
        }

        // Buscar encuesta seleccionada
        const encuestaActual = encuestas.find(enc => 
          enc && enc.id && enc.id.toString() === encuestaSeleccionada.toString()
        );

        if (!encuestaActual) {
          throw new Error('Encuesta seleccionada no encontrada');
        }

        // Obtener respuestas para esta encuesta según el filtro
        let respuestasFiltradas = [];
        
        if (tipoRespuestas === 'todas') {
          respuestasFiltradas = todasRespuestas[encuestaActual.id]?.respuestas || [];
        } else if (tipoRespuestas === 'publicas') {
          respuestasFiltradas = (todasRespuestas[encuestaActual.id]?.respuestas || [])
            .filter(resp => resp.desdePublico === true);
        } else if (tipoRespuestas === 'privadas') {
          respuestasFiltradas = (todasRespuestas[encuestaActual.id]?.respuestas || [])
            .filter(resp => resp.desdePublico !== true);
        }
        
        // Procesar cada pregunta
        const resultadosProcesados = encuestaActual.preguntas.map(pregunta => {
          // Validar estructura de pregunta
          if (!pregunta || !pregunta.id || !pregunta.tipo) {
            return {
              tipo: 'error',
              pregunta: 'Pregunta inválida',
              mensaje: 'La pregunta no tiene la estructura correcta'
            };
          }

          // Para preguntas de texto
          if (pregunta.tipo === 'respuesta-corta' || pregunta.tipo === 'parrafo') {
            const respuestasTexto = respuestasFiltradas
              .map(respuesta => ({
                valor: respuesta?.[pregunta.id],
                origen: respuesta.desdePublico ? 'Pública' : 'Privada',
                fecha: respuesta.fecha
              }))
              .filter(resp => resp.valor !== undefined && resp.valor !== null);
            
            return {
              tipo: 'texto',
              pregunta: pregunta.pregunta || 'Pregunta sin título',
              respuestas: respuestasTexto,
              totalRespuestas: respuestasTexto.length
            };
          }
          
          // Para opción múltiple
          if (pregunta.tipo === 'opcion-multiple') {
            const conteo = { publicas: {}, privadas: {}, total: {} };
            const opcionesValidas = Array.isArray(pregunta.opciones) ? pregunta.opciones : [];
            
            // Inicializar conteos
            opcionesValidas.forEach(opcion => {
              if (opcion !== undefined && opcion !== null) {
                conteo.publicas[opcion] = 0;
                conteo.privadas[opcion] = 0;
                conteo.total[opcion] = 0;
              }
            });
            
            // Contar respuestas
            respuestasFiltradas.forEach(respuesta => {
              const valor = respuesta?.[pregunta.id];
              if (valor !== undefined && valor !== null) {
                if (respuesta.desdePublico === true) {
                  if (conteo.publicas[valor] !== undefined) conteo.publicas[valor] += 1;
                } else {
                  if (conteo.privadas[valor] !== undefined) conteo.privadas[valor] += 1;
                }
                if (conteo.total[valor] !== undefined) conteo.total[valor] += 1;
              }
            });
            
            return {
              tipo: 'grafico',
              pregunta: pregunta.pregunta || 'Pregunta sin título',
              datos: {
                etiquetas: Object.keys(conteo.total),
                valores: Object.values(conteo.total),
                publicas: Object.values(conteo.publicas),
                privadas: Object.values(conteo.privadas)
              },
              totalRespuestas: respuestasFiltradas.length
            };
          }
          
          // Para casillas de verificación
          if (pregunta.tipo === 'casillas') {
            const conteo = { publicas: {}, privadas: {}, total: {} };
            const opcionesValidas = Array.isArray(pregunta.opciones) ? pregunta.opciones : [];
            
            // Inicializar conteos
            opcionesValidas.forEach(opcion => {
              if (opcion !== undefined && opcion !== null) {
                conteo.publicas[opcion] = 0;
                conteo.privadas[opcion] = 0;
                conteo.total[opcion] = 0;
              }
            });
            
            // Contar selecciones
            respuestasFiltradas.forEach(respuesta => {
              const selecciones = Array.isArray(respuesta?.[pregunta.id]) ? 
                respuesta[pregunta.id] : [];
              selecciones.forEach(seleccion => {
                if (seleccion !== undefined && seleccion !== null) {
                  if (respuesta.desdePublico === true) {
                    if (conteo.publicas[seleccion] !== undefined) conteo.publicas[seleccion] += 1;
                  } else {
                    if (conteo.privadas[seleccion] !== undefined) conteo.privadas[seleccion] += 1;
                  }
                  if (conteo.total[seleccion] !== undefined) conteo.total[seleccion] += 1;
                }
              });
            });
            
            return {
              tipo: 'grafico',
              pregunta: pregunta.pregunta || 'Pregunta sin título',
              datos: {
                etiquetas: Object.keys(conteo.total),
                valores: Object.values(conteo.total),
                publicas: Object.values(conteo.publicas),
                privadas: Object.values(conteo.privadas)
              },
              totalRespuestas: respuestasFiltradas.length
            };
          }
          
          // Para escala numérica
          if (pregunta.tipo === 'escala') {
            const valores = { 
              total: [0, 0, 0, 0, 0], 
              publicas: [0, 0, 0, 0, 0], 
              privadas: [0, 0, 0, 0, 0] 
            };
            
            respuestasFiltradas.forEach(respuesta => {
              const valor = respuesta?.[pregunta.id];
              if (typeof valor === 'number' && valor >= 1 && valor <= 5) {
                valores.total[valor - 1] += 1;
                if (respuesta.desdePublico === true) {
                  valores.publicas[valor - 1] += 1;
                } else {
                  valores.privadas[valor - 1] += 1;
                }
              }
            });
            
            return {
              tipo: 'grafico',
              pregunta: pregunta.pregunta || 'Pregunta sin título',
              datos: {
                etiquetas: ['1 (Malo)', '2', '3', '4', '5 (Excelente)'],
                valores: valores.total,
                publicas: valores.publicas,
                privadas: valores.privadas
              },
              totalRespuestas: respuestasFiltradas.length
            };
          }
          
          return {
            tipo: 'desconocido',
            pregunta: pregunta.pregunta || 'Pregunta sin título',
            mensaje: `Tipo de pregunta no soportado: ${pregunta.tipo}`
          };
        });
        
        setResultados(resultadosProcesados);
      } catch (err) {
        console.error("Error procesando resultados:", err);
        setError('Error al procesar los resultados. Por favor verifica los datos.');
      } finally {
        setIsLoading(false);
      }
    };

    procesarResultados();
  }, [encuestaSeleccionada, encuestas, tipoRespuestas]);

  // Renderizar gráfico según el tipo seleccionado
  const renderGrafico = (resultado) => {
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];

    const datasets = [{
      label: 'Total',
      data: resultado.datos.valores,
      backgroundColor: backgroundColors.slice(0, resultado.datos.etiquetas.length),
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1
    }];

    if (tipoRespuestas === 'todas') {
      datasets.push(
        {
          label: 'Públicas',
          data: resultado.datos.publicas,
          backgroundColor: backgroundColors.map(c => c.replace('0.7', '0.5')),
          borderColor: 'rgba(255, 255, 255, 0.6)',
          borderWidth: 1
        },
        {
          label: 'Privadas',
          data: resultado.datos.privadas,
          backgroundColor: backgroundColors.map(c => c.replace('0.7', '0.9')),
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1
        }
      );
    }

    const data = {
      labels: resultado.datos.etiquetas,
      datasets: datasets
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = resultado.totalRespuestas;
              const value = context.raw;
              const percentage = total ? ((value / total) * 100).toFixed(1) + '%' : '0%';
              return `${context.dataset.label}: ${value} (${percentage})`;
            }
          }
        }
      }
    };

    return tipoGrafico === 'barra' ? (
      <Bar data={data} options={options} />
    ) : (
      <Pie data={data} options={options} />
    );
  };

  // Exportar resultados a CSV
  const exportarCSV = () => {
    if (!encuestaSeleccionada || resultados.length === 0) return;

    const encuesta = encuestas.find(e => e.id.toString() === encuestaSeleccionada.toString());
    if (!encuesta) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Pregunta,Tipo,Respuestas,Origen,Fecha,Total\n";
    
    // Datos
    resultados.forEach(resultado => {
      if (resultado.tipo === 'texto') {
        resultado.respuestas.forEach(respuesta => {
          const row = [
            `"${resultado.pregunta}"`,
            resultado.tipo,
            `"${respuesta.valor}"`,
            respuesta.origen,
            respuesta.fecha,
            resultado.totalRespuestas || 0
          ].join(',');
          csvContent += row + "\n";
        });
      } else {
        const row = [
          `"${resultado.pregunta}"`,
          resultado.tipo,
          resultado.tipo === 'grafico'
            ? `"${resultado.datos.etiquetas.map((e, i) => `${e}: ${resultado.datos.valores[i]}`).join('; ')}"`
            : `"${resultado.mensaje}"`,
          tipoRespuestas === 'todas' ? 'Todos' : tipoRespuestas === 'publicas' ? 'Públicas' : 'Privadas',
          new Date().toISOString(),
          resultado.totalRespuestas || 0
        ].join(',');
        csvContent += row + "\n";
      }
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resultados_${encuesta.titulo.replace(/\s+/g, '_')}_${tipoRespuestas}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="contenedor">
        <div className="cargando">
          <p>Cargando resultados...</p>
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
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  // Mostrar cuando no hay encuestas
  if (encuestas.length === 0) {
    return (
      <div className="contenedor">
        <h1>Resultados de Encuestas</h1>
        <p>No hay encuestas disponibles para mostrar resultados.</p>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <h1>Resultados de Encuestas</h1>
      
      <div className="controles-superiores">
        <div className="selector-encuesta">
          <label>Seleccionar encuesta: </label>
          <select
            value={encuestaSeleccionada || ''}
            onChange={(e) => setEncuestaSeleccionada(e.target.value)}
            disabled={isLoading}
          >
            {encuestas.map((encuesta) => (
              <option key={encuesta.id} value={encuesta.id}>
                {encuesta.titulo} ({new Date(encuesta.fecha).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="controles-derecha">
          <div className="selector-grafico">
            <label>Tipo de gráfico: </label>
            <select
              value={tipoGrafico}
              onChange={(e) => setTipoGrafico(e.target.value)}
            >
              <option value="barra">Barras</option>
              <option value="pastel">Pastel</option>
            </select>
          </div>

          <div className="selector-tipo-respuestas">
            <label>Tipo respuestas: </label>
            <select
              value={tipoRespuestas}
              onChange={(e) => setTipoRespuestas(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="publicas">Públicas</option>
              <option value="privadas">Privadas</option>
            </select>
          </div>

          <button 
            onClick={exportarCSV}
            className="boton-secundario"
            disabled={resultados.length === 0}
          >
            Exportar CSV
          </button>
        </div>
      </div>
      
      <div className="resultados-lista">
        {resultados.length === 0 ? (
          <p>No hay respuestas para esta encuesta.</p>
        ) : (
          resultados.map((resultado, index) => (
            <div key={index} className="resultado-item">
              <h3>{index + 1}. {resultado.pregunta}</h3>
              <p className="total-respuestas">
                Total respuestas: {resultado.totalRespuestas || 0}
                {tipoRespuestas === 'todas' && (
                  <span className="desglose-respuestas">
                    (Públicas: {(resultado.datos?.publicas?.reduce((a, b) => a + b, 0) || 0)}, 
                    Privadas: {(resultado.datos?.privadas?.reduce((a, b) => a + b, 0) || 0)})
                  </span>
                )}
              </p>
              
              {resultado.tipo === 'texto' && (
                <div className="respuestas-texto">
                  <h4>Respuestas recibidas:</h4>
                  {resultado.respuestas?.length > 0 ? (
                    <table className="tabla-respuestas">
                      <thead>
                        <tr>
                          <th>Respuesta</th>
                          <th>Origen</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.respuestas.map((respuesta, i) => (
                          <tr key={i}>
                            <td>{respuesta.valor || "[Sin respuesta]"}</td>
                            <td>{respuesta.origen}</td>
                            <td>{new Date(respuesta.fecha).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No hay respuestas de texto para esta pregunta.</p>
                  )}
                </div>
              )}
              
              {resultado.tipo === 'grafico' && (
                <div className="grafico-container">
                  {renderGrafico(resultado)}
                </div>
              )}
              
              {resultado.tipo === 'error' && (
                <p className="error-message">{resultado.mensaje}</p>
              )}
              
              {resultado.tipo === 'desconocido' && (
                <p className="tipo-no-soportado">{resultado.mensaje}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VerResultados;