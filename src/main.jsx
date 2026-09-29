import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { GameStateProvider } from './contexts/GameStateContext';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameStateProvider>
      <App />
    </GameStateProvider>
  </StrictMode>,
);
