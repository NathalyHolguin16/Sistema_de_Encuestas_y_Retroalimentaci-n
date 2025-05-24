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
  // Expresión regular simple para emails
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

