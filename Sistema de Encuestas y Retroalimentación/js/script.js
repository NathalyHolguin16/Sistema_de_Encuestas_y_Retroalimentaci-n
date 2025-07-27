// -------------------- FUNCIONES DE VALIDACIÓN --------------------

function validarFormulario(formId) {
  const form = document.getElementById(formId);
  let valido = true;
  let mensajesError = [];

  form.querySelectorAll('input[required]').forEach(input => {
    if (!input.value.trim()) {
      valido = false;
      mensajesError.push(`El campo "${input.name}" es obligatorio.`);
    }
  });

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

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

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

// -------------------- AL CARGAR EL DOM --------------------

document.addEventListener("DOMContentLoaded", function () {

  // ----------- LOGIN ----------
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', function (event) {
      event.preventDefault();
      if (validarFormulario('form-login')) {
        window.location.href = "index.html";
      }
    });
  }

  // ----------- REGISTRO ----------
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    formRegistro.addEventListener('submit', function (event) {
      event.preventDefault();
      if (validarFormulario('form-registro') && validarRegistro()) {
        window.location.href = "index.html";
      }
    });
  }

  // ----------- GRÁFICA DE BARRAS ----------
  if (document.getElementById('barChart')) {
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
        maintainAspectRatio: false,
        layout: { padding: 20 },
        scales: {
          x: {
            ticks: { font: { size: 20 } },
            barPercentage: 0.9,
            categoryPercentage: 1
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: { size: 14 },
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
              font: { size: 14 },
              padding: 20
            }
          }
        }
      }
    });
  }

  // ----------- GRÁFICA DE PASTEL ----------
  if (document.getElementById('pieChart')) {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Sí', 'No'],
        datasets: [{
          data: [80, 20],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      },
      options: { responsive: true }
    });
  }

  // ----------- EXPORTAR A EXCEL ----------
  if (document.getElementById('btnExportExcel')) {
    document.getElementById('btnExportExcel').addEventListener('click', function () {
      const tabla = document.getElementById('tablaResultados');
      const workbook = XLSX.utils.table_to_book(tabla);
      XLSX.writeFile(workbook, 'resultados_encuesta.xlsx');
    });
  }

  // ----------- AGREGAR PREGUNTA EN CREAR ENCUESTA ----------
  if (document.getElementById("agregar-pregunta")) {
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
  }

});
