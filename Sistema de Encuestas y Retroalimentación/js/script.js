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

//validacion y que la contrseña tenga minimo 6 digitos
  function validarRegistro() {
  const password = document.getElementById('password').value;
  const confirmar = document.getElementById('confirmar').value;
    let mensajesError = [];

     if (!password) {
    mensajesError.push('El campo "contraseña" es obligatorio.');
  } else if (password.length < 6) {
    mensajesError.push('La contraseña debe tener al menos 6 caracteres.');
  }


  if (!confirmar) {
    mensajesError.push('El campo "confirmar contraseña" es obligatorio.');
  } else if (password !== confirmar) {
    mensajesError.push('Las contraseñas no coinciden.');
  }

  if (mensajesError.length > 0) {
    alert(mensajesError.join('\n'));
    return false;
  }

  return true;
}



// Ejemplo: Validar formulario login al enviar
if(document.getElementById('form-login')){
  document.getElementById('form-login').addEventListener('submit', function(event) {
      event.preventDefault();

        if(validarFormulario('form-login')){
          window.location.href = "index.html";
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
    new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
        labels: ['Excelente', 'Bueno', 'Regular', 'Malo'],
        datasets: [{
            label: 'Respuestas (%)',
            data: [45, 30, 15, 10],
            backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Esto permite que el gráfico llene el contenedor
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 20 // Tamaño de fuente para las etiquetas del eje X
                    }
                },
                barPercentage: 0.9, // Controla el ancho de las barras (0.1 a 1)
                categoryPercentage: 1 // Espacio entre categorías
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        size: 14 // Tamaño de fuente para las etiquetas del eje Y
                    },
                    stepSize: 20
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14 // Tamaño de fuente para la leyenda
                    },
                    padding: 20
                }
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


    // Exportar a Excel
    document.getElementById('btnExportExcel').addEventListener('click', function() {
        const tabla = document.getElementById('tablaResultados');
        const workbook = XLSX.utils.table_to_book(tabla);
        XLSX.writeFile(workbook, 'resultados_encuesta.xlsx');
    });
});

// bloque de preguntas
let contadorPreguntas = 2; 

document.getElementById("agregar-pregunta").addEventListener("click", () => {
  const contenedor = document.getElementById("contenedor-preguntas");

  const bloque = document.createElement("div");
  bloque.classList.add("bloque-pregunta");
  bloque.style.marginTop = "20px";

  bloque.innerHTML = `
    <label>Pregunta ${contadorPreguntas}:</label>
    <input type="text" required>

    <label>Ingrese respuesta</label>
    <input type="text" required>

    <label>Tipo de respuesta:</label>
    <select>
      <option>Opción múltiple</option>
      <option>Respuesta corta</option>
      <option>Escala de satisfacción</option>
    </select>
  `;

  contenedor.appendChild(bloque);
  contadorPreguntas++;
});