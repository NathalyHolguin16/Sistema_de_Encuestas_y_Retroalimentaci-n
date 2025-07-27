import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

function Resultados() {
  const barRef = useRef(null);
  const pieRef = useRef(null);

  // Datos de ejemplo
  const data = {
    preguntas: ["¿Cómo calificaría nuestro servicio?", "¿Recomendaría nuestro producto?"],
    respuestas: {
      servicio: ["Excelente", "Bueno", "Regular", "Malo"],
      servicioCount: [45, 30, 15, 10],
      recomendacion: ["Sí", "No"],
      recomendacionCount: [80, 20]
    }
  };

  useEffect(() => {
    // Gráfico de barras
    new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: data.respuestas.servicio,
        datasets: [{
          label: 'Respuestas (%)',
          data: data.respuestas.servicioCount,
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });

    // Gráfico de pastel
    new Chart(pieRef.current, {
      type: 'pie',
      data: {
        labels: data.respuestas.recomendacion,
        datasets: [{
          data: data.respuestas.recomendacionCount,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }, []);

  // Exportar a Excel
  const exportarExcel = () => {
    const tabla = document.getElementById('tablaResultados');
    const workbook = XLSX.utils.table_to_book(tabla);
    XLSX.writeFile(workbook, 'resultados_encuesta.xlsx');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Resultados de la Encuesta: Satisfacción del Cliente</h1>
      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Filtrar por fecha:</label>
          <input type="date" className="form-control" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Filtrar por pregunta:</label>
          <select className="form-select">
            <option>Todas las preguntas</option>
            <option>¿Cómo calificaría nuestro servicio?</option>
            <option>¿Recomendaría nuestro producto?</option>
          </select>
        </div>
      </div>
      {/* Gráfico de Barras */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Gráfico de Barras - Respuestas por Pregunta</h5>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <canvas ref={barRef}></canvas>
          </div>
        </div>
      </div>
      {/* Gráfico de Pastel */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Gráfico de Pastel - Distribución de Respuestas</h5>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <canvas ref={pieRef}></canvas>
          </div>
        </div>
      </div>
      {/* Tabla de Resultados */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Datos Detallados</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped" id="tablaResultados">
              <thead>
                <tr>
                  <th>Pregunta</th>
                  <th>Respuesta</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>¿Cómo calificaría nuestro servicio?</td>
                  <td>Excelente</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td>¿Cómo calificaría nuestro servicio?</td>
                  <td>Bueno</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>¿Recomendaría nuestro producto?</td>
                  <td>Sí</td>
                  <td>80%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Botón de Exportar */}
      <div className="export-buttons text-center">
        <button onClick={exportarExcel} className="btn btn-success">
          Exportar a Excel
        </button>
      </div>
    </div>
  );
}

export default Resultados;