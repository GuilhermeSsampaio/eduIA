import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './StartScreen.css';

export const StartScreen = () => {
  const { startGame } = useGameState();

  const handleStart = () => {
    audioService.playClick();
    startGame();
  };

  return (
    <ScreenContainer>
      <div className="start-content">
        <h1 className="game-title">Ética em IA</h1>
        <p className="game-subtitle">Uma jornada sobre escolhas no mundo generativo</p>
        
        <div className="instructions">
          <p>Você enfrentará dilemas reais sobre o uso da Inteligência Artificial.</p>
          <p>Tome decisões e veja o impacto das suas escolhas!</p>
        </div>

        <button className="start-btn" onClick={handleStart}>
          INICIAR JOGO
        </button>
      </div>
    </ScreenContainer>
  );
};
