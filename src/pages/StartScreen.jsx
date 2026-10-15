import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import logo from '../assets/logogame.png';
import './StartScreen.css';

export const StartScreen = () => {
  const { startGame, goToCredits } = useGameState();

  const handleStart = () => {
    // Chamado de forma síncrona dentro do gesto do usuário (clique), o que
    // satisfaz a política de Autoplay: o AudioContext é criado/retomado aqui.
    audioService.playClick();
    audioService.startBgm();
    startGame();
  };

  const handleCredits = () => {
    audioService.playClick();
    goToCredits();
  };

  return (
    // lockViewport: trava em 100vh sem scroll apenas nesta tela
    <ScreenContainer className="start-screen" lockViewport>
      <div className="start-content fade-enter-active">
        <div className="title-section">
          <span className="hero-badge">CIDADANIA &amp; MUNDO DIGITAL</span>
          <h1 className="game-title">
            <img
              src={logo}
              alt="EduAI: Raciocínio vs IA"
              className="game-logo"
              draggable="false"
            />
          </h1>
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
          <button className="start-btn" onClick={handleStart} aria-label="Iniciar jogada, 6 fases">
            <span className="start-btn-label">INICIAR JOGADA</span>
            <span className="start-btn-sub">(6 FASES)</span>
          </button>
          
          <button className="credits-btn" onClick={handleCredits}>
            CREDITOS DO JOGO
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
};
