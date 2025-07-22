import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'
    import App from './App.tsx'
    import './index.css'

    console.log('main.tsx: Attempting to render App...');

    const rootElement = document.getElementById('root');

    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
      console.log('main.tsx: App rendering initiated.');
    } else {
      console.error('main.tsx: Root element #root not found!');
    }
