import { useState, useEffect } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { audioService } from '../../services/AudioService';
import './ScreenContainer.css';

export const ScreenContainer = ({ children, className = '', topLeft = null, lockViewport = false }) => {
  const [show, setShow] = useState(false);
  const { theme, toggleTheme } = useGameState();
  const [isMuted, setIsMuted] = useState(audioService.isMuted);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  // Trava a página em 100vh (sem scroll) apenas enquanto esta tela estiver montada
  useEffect(() => {
    if (!lockViewport) return;
    document.documentElement.classList.add('viewport-locked');
    return () => document.documentElement.classList.remove('viewport-locked');
  }, [lockViewport]);

  const handleToggleAudio = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleTheme = () => {
    audioService.playClick();
    toggleTheme();
  };

  const classes = [
    'screen-container',
    show ? 'fade-enter-active' : 'fade-enter',
    lockViewport ? 'screen-locked' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="top-global-bar">
        <div className="top-bar-left">{topLeft}</div>
        <div className="top-bar-right">
          <button className="top-bar-btn" onClick={handleToggleAudio} title="Alternar áudio">
            {isMuted ? 'Som: Desativado' : 'Som: Ativado'}
          </button>
          <button className="top-bar-btn" onClick={handleToggleTheme} title="Alternar tema">
            {theme === 'dark' ? 'Modo: Escuro' : 'Modo: Claro'}
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};
