import React from 'react';

import inicioImg from './resources/inicio.jpg';

function Inicio() {
  return (
    <div className="layout-inicio">
      <div className="columna-izquierda">
        <img src={inicioImg} alt="Imagen de inicio" className="imagen-inicio" />
      </div>

      <div className="columna-derecha">
        <div className="contenedor inicio">
          <h1>Sistema de encuestas y retroalimentación</h1>
          <br />
          <p>
            Sea bienvenido al sistema donde puedes crear encuestas, responderlas y ver resultados.
          </p>

          <div className="tarjetas-opciones">
            <div className="tarjeta">
              <h3>Crear Encuesta</h3>
              <p>Diseña encuestas personalizadas para tus usuarios.</p>
              <a className="boton" href="/crear">Crear</a>
            </div>

            <div className="tarjeta">
              <h3>Responder Encuesta</h3>
              <p>Participa y da tu opinión completando encuestas.</p>
              <a className="boton" href="/responder">Responder</a>
            </div>

            <div className="tarjeta">
             <h3>Ver Resultados</h3>
              <p>Consulta los resultados obtenidos de las encuestas.</p>
              <a className="boton" href="/resultados">Ver</a>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;

