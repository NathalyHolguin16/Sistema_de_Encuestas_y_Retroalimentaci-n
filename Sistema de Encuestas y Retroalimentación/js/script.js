// Validación simple para formularios de login y registro
function validarFormulario(formId) {
  const form = document.getElementById(formId);
  let valido = true;
  let mensajesError = [];

  // Validar campos requeridos (input con atributo required)
  form.querySelectorAll('input[required]').forEach(input => {
    if (!input.value.trim()) {
      valido = false;
      mensajesError.push(`El campo "${input.name}" es obligatorio.`);
    }
  });

  // Validar email si existe
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    const email = emailInput.value.trim();
    if (email && !validarEmail(email)) {
      valido = false;
      mensajesError.push('El email no tiene un formato válido.');
    }
  }

  if (!valido) {
    alert(mensajesError.join('\n'));
  }
  return valido;
}

// Función auxiliar para validar formato de email
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Ejemplo: Validar formulario login al enviar
if(document.getElementById('form-login')){
  document.getElementById('form-login').addEventListener('submit', function(event){
    if(!validarFormulario('form-login')){
      event.preventDefault();
    }
  });
}

// Ejemplo: Validar formulario registro al enviar
if(document.getElementById('form-registro')){
  document.getElementById('form-registro').addEventListener('submit', function(event){
    if(!validarFormulario('form-registro')){
      event.preventDefault();
    }
  });
}

// Código para gráfica con Chart.js (usado en resultados.html)
function crearGrafica(idCanvas, etiquetas, datos) {
  const ctx = document.getElementById(idCanvas).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Respuestas',
        data: datos,
        backgroundColor: 'skyblue'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Datos de ejemplo (simulados)
const data = {
    preguntas: ["¿Cómo calificaría nuestro servicio?", "¿Recomendaría nuestro producto?"],
    respuestas: {
        servicio: ["Excelente", "Bueno", "Regular", "Malo"],
        servicioCount: [45, 30, 15, 10], // Porcentajes
        recomendacion: ["Sí", "No"],
        recomendacionCount: [80, 20]
    }
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de Barras
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: data.respuestas.servicio,
            datasets: [{
                label: 'Respuestas (%)',
                data: data.respuestas.servicioCount,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Gráfico de Pastel
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
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

    // Exportar a PDF
    document.getElementById('btnExportPDF').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text("Resultados de Encuesta - Satisfacción del Cliente", 10, 10);
        doc.autoTable({
            html: '#tablaResultados',
            startY: 20
        });
        
        doc.save('resultados_encuesta.pdf');
    });

    // Exportar a Excel
    document.getElementById('btnExportExcel').addEventListener('click', function() {
        const tabla = document.getElementById('tablaResultados');
        const workbook = XLSX.utils.table_to_book(tabla);
        XLSX.writeFile(workbook, 'resultados_encuesta.xlsx');
    });
});