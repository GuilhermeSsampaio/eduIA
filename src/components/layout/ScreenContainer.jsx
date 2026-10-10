import { useState, useEffect } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { audioService } from '../../services/AudioService';
import './ScreenContainer.css';

export const ScreenContainer = ({ children }) => {
  const [show, setShow] = useState(false);
  const { theme, toggleTheme } = useGameState();
  const [isMuted, setIsMuted] = useState(audioService.isMuted);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  const handleToggleAudio = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleTheme = () => {
    audioService.playClick();
    toggleTheme();
  };

  return (
    <div className={`screen-container ${show ? 'fade-enter-active' : 'fade-enter'}`}>
      <div className="top-global-bar">
        <button className="top-bar-btn" onClick={handleToggleAudio} title="Alternar áudio">
          {isMuted ? 'Som: Desativado' : 'Som: Ativado'}
        </button>
        <button className="top-bar-btn" onClick={handleToggleTheme} title="Alternar tema">
          {theme === 'dark' ? 'Modo: Escuro' : 'Modo: Claro'}
        </button>
      </div>
      {children}
    </div>
  );
};
