import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Mover BrowserRouter aquí
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Solo un Router en toda la app */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

