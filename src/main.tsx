// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )





import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Root-Element finden und React-App anhängen
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root-Element mit id="root" nicht gefunden. Ist index.html korrekt?');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
