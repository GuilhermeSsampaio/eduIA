import { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './StartScreen.css';

export const StartScreen = () => {
  const { startGame, goToCredits } = useGameState();
  const [isMuted, setIsMuted] = useState(audioService.isMuted);

  const handleStart = () => {
    audioService.playClick();
    audioService.startBgm();
    startGame();
  };

  const handleToggleAudio = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleCredits = () => {
    audioService.playClick();
    goToCredits();
  };

  return (
    <ScreenContainer>
      <div className="start-content fade-enter-active">
        <div className="top-bar">
          <button className="audio-toggle-btn" onClick={handleToggleAudio} title="Alternar som">
            {isMuted ? 'Som: Desativado' : 'Som: Ativado'}
          </button>
        </div>

        <div className="title-section">
          <span className="hero-badge">EDUCAÇÃO & ÉTICA DIGITAL</span>
          <h1 className="game-title">EduAI: Raciocínio vs IA</h1>
          <p className="game-subtitle">Uma jornada interativa sobre autonomia, fontes reais e escolhas no mundo generativo</p>
        </div>

        <div className="instructions-card">
          <h3>Como Funciona:</h3>
          <ul className="rules-list">
            <li><strong>História:</strong> Acompanhe casos reais sobre o impacto da IA no mundo.</li>
            <li><strong>Fatos Reais:</strong> Confira notícias e pesquisas verídicas de cada caso.</li>
            <li><strong>Desafio Prático:</strong> Tome decisões em dilemas do seu dia a dia.</li>
            <li><strong>Diagnóstico:</strong> Avalie seu Raciocínio Próprio vs Dependência de IA.</li>
          </ul>
        </div>

        <div className="start-actions">
          <button className="start-btn" onClick={handleStart}>
            INICIAR JOGADA (6 FASES)
          </button>
          
          <button className="credits-btn" onClick={handleCredits}>
            CRÉDITOS DO JOGO
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
};
