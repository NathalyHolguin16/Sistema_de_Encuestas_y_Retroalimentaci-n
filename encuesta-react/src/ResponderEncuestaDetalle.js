const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validar preguntas requeridas
  for (const pregunta of encuesta.preguntas) {
    if (pregunta.requerida && !respuestas[pregunta.id]) {
      alert(`La pregunta "${pregunta.pregunta}" es requerida`);
      return;
    }
  }

  // Obtener respuestas existentes
  let todasLasRespuestas = {};
  try {
    const respuestasData = localStorage.getItem('respuestas');
    // Verificar si hay datos y si son válidos
    if (respuestasData) {
      // Si los datos son un objeto (no debería pasar), usarlos directamente
      if (typeof respuestasData === 'object') {
        todasLasRespuestas = respuestasData;
      } else {
        // Si es una cadena, intentar parsearla
        todasLasRespuestas = JSON.parse(respuestasData);
      }
    }
  } catch (error) {
    console.error('Error al leer respuestas:', error);
    // Si hay error de parseo, inicializar como objeto vacío
    todasLasRespuestas = {};
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
    desdePublico: false // Marcamos como respuesta privada
  });

  // Guardar en localStorage
  try {
    localStorage.setItem('respuestas', JSON.stringify(todasLasRespuestas));
    alert('¡Gracias por responder la encuesta!');
    navigate('/inicio');
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    alert('Ocurrió un error al guardar tus respuestas. Por favor intenta nuevamente.');
  }
};