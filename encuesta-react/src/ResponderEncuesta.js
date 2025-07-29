import React from 'react';

function ResponderEncuesta() {
  const encuestas = [
    {
      titulo: '📚 Encuesta Educativa',
      descripcion: 'Matemáticas, Lenguaje, Ciencias Sociales y Naturales, etc.',
    },
    {
      titulo: '📊 Encuesta Empresarial',
      descripcion: 'Atención al cliente, satisfacción laboral, seguridad industrial, etc.',
    },
    {
      titulo: '👤 Satisfacción del cliente',
      descripcion: 'Satisfacción, críticas, recomendaciones.',
    },
    {
      titulo: '🚑 Encuesta de Salud',
      descripcion: 'Satisfacción con los servicios de salud, síntomas.',
    },
  ];

  const realizarEncuesta = (titulo) => {
    alert(`Iniciando: ${titulo}`);
    // Aquí luego podemos redirigir a un formulario con preguntas reales
  };

  return (
    <div className="contenedor">
      <h1>Encuestas Disponibles</h1>
      <br />
      <div className="tarjetas-opciones2">
        {encuestas.map((encuesta, index) => (
          <div className="tarjeta" key={index}>
            <h3>{encuesta.titulo}</h3>
            <p>{encuesta.descripcion}</p>
            <br />
            <button className="boton" onClick={() => realizarEncuesta(encuesta.titulo)}>
              Realizar Encuesta
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponderEncuesta;

