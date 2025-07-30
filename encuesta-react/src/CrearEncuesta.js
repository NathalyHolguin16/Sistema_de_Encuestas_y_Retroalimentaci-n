import React, { useState } from 'react';
import './CrearEncuesta.css';

function CrearEncuesta() {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([
    { 
      id: Date.now(), 
      pregunta: '', 
      tipo: 'opcion-multiple', 
      opciones: ['', ''], 
      requerida: false 
    }
  ]);
  
  // Nuevo estado para el enlace generado
  const [enlaceGenerado, setEnlaceGenerado] = useState('');

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { 
        id: `pregunta-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
        pregunta: '', 
        tipo: 'opcion-multiple', 
        opciones: ['', ''], 
        requerida: false 
      }
    ]);
  };

  const eliminarPregunta = (id) => {
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const agregarOpcion = (preguntaIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones.push('');
    setPreguntas(nuevasPreguntas);
  };

  const eliminarOpcion = (preguntaIndex, opcionIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
    setPreguntas(nuevasPreguntas);
  };

  const handlePreguntaChange = (id, campo, valor) => {
    setPreguntas(preguntas.map(p => 
      p.id === id ? {...p, [campo]: valor} : p
    ));
  };

  const handleOpcionChange = (preguntaId, opcionIndex, valor) => {
    setPreguntas(preguntas.map(p => {
      if (p.id === preguntaId) {
        const nuevasOpciones = [...p.opciones];
        nuevasOpciones[opcionIndex] = valor;
        return {...p, opciones: nuevasOpciones};
      }
      return p;
    }));
  };

  const toggleRequerida = (id) => {
    setPreguntas(preguntas.map(p => 
      p.id === id ? {...p, requerida: !p.requerida} : p
    ));
  };

  // Función para copiar el enlace al portapapeles
  const copiarEnlace = () => {
    navigator.clipboard.writeText(enlaceGenerado)
      .then(() => {
        alert('Enlace copiado al portapeles');
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
        alert('Error al copiar el enlace');
      });
  };

  // Función para compartir la encuesta
  const compartirEncuesta = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Participa en mi encuesta',
        text: 'Por favor, responde mi encuesta:',
        url: enlaceGenerado,
      })
      .catch(error => console.log('Error al compartir', error));
    } else {
      alert('La función de compartir no está disponible en este navegador. Copia el enlace manualmente.');
    }
  };

  const guardarEncuesta = (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    // Validar preguntas
    for (const [index, p] of preguntas.entries()) {
      if (!p.pregunta.trim()) {
        alert(`La pregunta ${index + 1} no puede estar vacía`);
        return;
      }
      
      if (['opcion-multiple', 'casillas'].includes(p.tipo)) {
        for (const [i, opcion] of p.opciones.entries()) {
          if (!opcion.trim()) {
            alert(`La opción ${i + 1} de la pregunta ${index + 1} no puede estar vacía`);
            return;
          }
        }
      }
    }

    // Generar un ID único para la encuesta
    const idEncuesta = Date.now();
    
    // Guardar en localStorage
    const encuesta = {
      id: idEncuesta,
      titulo,
      preguntas,
      fecha: new Date().toISOString()
    };

    const encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    encuestasGuardadas.push(encuesta);
    localStorage.setItem('encuestas', JSON.stringify(encuestasGuardadas));

    alert('Encuesta guardada correctamente ✅');

    // Generar enlace único para compartir
    const enlace = `${window.location.origin}/responder-encuesta-detalle/${idEncuesta}`;
    setEnlaceGenerado(enlace);

    // Resetear formulario (opcional, comentado para que el usuario vea el enlace)
    /*
    setTitulo('');
    setPreguntas([
      { 
        id: Date.now(), 
        pregunta: '', 
        tipo: 'opcion-multiple', 
        opciones: ['', ''], 
        requerida: false 
      }
    ]);
    */
  };

  return (
    <div className="contenedor">
      <h2>Crear Nueva Encuesta</h2>
      <br />
      <form className="formulario" onSubmit={guardarEncuesta}>
        <div className="bloque-pregunta">
          <label>Título de la encuesta:</label>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
            placeholder="Ej: Satisfacción del cliente"
          />
        </div>

        {preguntas.map((p, preguntaIndex) => (
          <div className="bloque-pregunta" key={p.id}>
            <div className="encabezado-pregunta">
              <input
                type="text"
                value={p.pregunta}
                onChange={e => handlePreguntaChange(p.id, 'pregunta', e.target.value)}
                required
                placeholder={`Pregunta ${preguntaIndex + 1}`}
                className="input-pregunta"
              />
              
              <div className="controles-pregunta">
                <select
                  value={p.tipo}
                  onChange={e => handlePreguntaChange(p.id, 'tipo', e.target.value)}
                >
                  <option value="opcion-multiple">Opción múltiple</option>
                  <option value="respuesta-corta">Respuesta corta</option>
                  <option value="parrafo">Párrafo</option>
                  <option value="escala">Escala de satisfacción</option>
                  <option value="casillas">Casillas de verificación</option>
                </select>
                
                <label className="requerida-label">
                  <input
                    type="checkbox"
                    checked={p.requerida}
                    onChange={() => toggleRequerida(p.id)}
                  />
                  Requerida
                </label>
                
                {preguntas.length > 1 && (
                  <button 
                    type="button" 
                    className="boton-eliminar"
                    onClick={() => eliminarPregunta(p.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {(p.tipo === 'opcion-multiple' || p.tipo === 'casillas') && (
              <div className="opciones-container">
                {p.opciones.map((opcion, opcionIndex) => (
                  <div key={opcionIndex} className="opcion-item">
                    <div className="tipo-opcion">
                      {p.tipo === 'opcion-multiple' ? '○' : '☐'}
                    </div>
                    <input
                      type="text"
                      value={opcion}
                      onChange={e => handleOpcionChange(p.id, opcionIndex, e.target.value)}
                      placeholder={`Opción ${opcionIndex + 1}`}
                      className="input-opcion"
                    />
                    {p.opciones.length > 2 && (
                      <button
                        type="button"
                        className="boton-eliminar-opcion"
                        onClick={() => eliminarOpcion(preguntaIndex, opcionIndex)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="boton-agregar-opcion"
                  onClick={() => agregarOpcion(preguntaIndex)}
                >
                  + Agregar opción
                </button>
              </div>
            )}

            {p.tipo === 'respuesta-corta' && (
              <input
                type="text"
                disabled
                placeholder="Respuesta corta"
                className="input-deshabilitado"
              />
            )}

            {p.tipo === 'parrafo' && (
              <textarea
                disabled
                placeholder="Respuesta larga"
                className="input-deshabilitado"
                rows={3}
              />
            )}

            {p.tipo === 'escala' && (
              <div className="escala-container">
                <div className="escala-labels">
                  <span>1 (Malo)</span>
                  <span>5 (Excelente)</span>
                </div>
                <div className="escala-puntos">
                  {[1, 2, 3, 4, 5].map(punto => (
                    <div key={punto} className="punto-escala">
                      <div className="circulo-escala"></div>
                      <span>{punto}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="acciones-encuesta">
          <button type="button" className="boton boton-secundario" onClick={agregarPregunta}>
            + Agregar Pregunta
          </button>
          <button type="submit" className="boton">
            Guardar Encuesta
          </button>
        </div>
      </form>

      {/* Sección para mostrar el enlace después de guardar */}
      {enlaceGenerado && (
        <div className="enlace-generado">
          <h3>Enlace para compartir tu encuesta</h3>
          <p>Comparte este enlace con los participantes:</p>
          
          <div className="input-enlace">
            <input 
              type="text" 
              value={enlaceGenerado} 
              readOnly 
              className="input-field"
            />
            <button 
              type="button" 
              className="boton boton-copiar"
              onClick={copiarEnlace}
            >
              Copiar
            </button>
          </div>
          
          <div className="share-buttons">
            <button 
              type="button" 
              className="boton"
              onClick={compartirEncuesta}
            >
              Compartir Encuesta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearEncuesta;

