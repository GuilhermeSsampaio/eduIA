import { useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './GameScreen.css';

export const GameScreen = () => {
  const { currentPhase, submitAnswer, lastSelectedOption, currentScreen, nextPhase } = useGameState();

  const handleOptionClick = (option) => {
    audioService.playConfirm();
    submitAnswer(option);
  };

  const handleNextPhase = () => {
    audioService.playClick();
    nextPhase();
  };

  return (
    <ScreenContainer>
      <div className="game-section case-section">
        <h2 className="phase-title">Fase: {currentPhase.theme}</h2>
        <p className="case-text">{currentPhase.caseText}</p>
        <p className="question-text">{currentPhase.question}</p>
      </div>

      <div className="game-section options-section">
        {currentPhase.options.map((option) => (
          <button 
            key={option.id} 
            className={`option-btn ${lastSelectedOption?.id === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            disabled={currentScreen === 'feedback'}
          >
            {option.text}
          </button>
        ))}
      </div>

      {currentScreen === 'feedback' && lastSelectedOption && (
        <div className="game-section feedback-section fade-enter-active">
          <h3>Feedback Educativo</h3>
          <p className="feedback-text">{lastSelectedOption.feedback}</p>
          <button className="next-btn" onClick={handleNextPhase}>
            Próxima Fase
          </button>
        </div>
      )}
    </ScreenContainer>
  );
};
