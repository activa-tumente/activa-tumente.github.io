import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>BULLS App - Página de prueba</h1>
      <p>Si puedes ver esta página, el servidor está funcionando correctamente.</p>
      <p>Esta es una versión simplificada de la aplicación para probar la configuración básica.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
        <h2>Información de depuración</h2>
        <p>Fecha y hora: {new Date().toLocaleString()}</p>
        <p>URL: {window.location.href}</p>
        <p>Navegador: {navigator.userAgent}</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Aplicación de prueba renderizada correctamente');
