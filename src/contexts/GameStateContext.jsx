import { createContext, useContext, useState } from 'react';
import phasesData from '../data/phases.json';

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('start'); // start, presentation, quiz, feedback, report
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [scores, setScores] = useState({ cognitive: 0, techDependence: 0 });
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [lastSelectedOption, setLastSelectedOption] = useState(null);

  const startGame = () => {
    setCurrentScreen('presentation');
    setCurrentPhaseIndex(0);
    setScores({ cognitive: 0, techDependence: 0 });
    setPlayerAnswers([]);
    setLastSelectedOption(null);
  };

  const currentPhase = phasesData[currentPhaseIndex];

  const submitAnswer = (option) => {
    setLastSelectedOption(option);
    
    // Update scores
    setScores(prev => ({
      cognitive: prev.cognitive + option.scoreCognitive,
      techDependence: prev.techDependence + option.scoreTechDependence
    }));
    
    // Save history
    setPlayerAnswers(prev => [...prev, { phaseId: currentPhase.id, optionId: option.id }]);
    
    // Go to feedback screen
    setCurrentScreen('feedback');
  };

  const nextPhase = () => {
    if (currentPhaseIndex + 1 < phasesData.length) {
      setCurrentPhaseIndex(prev => prev + 1);
      setCurrentScreen('presentation');
    } else {
      setCurrentScreen('report');
    }
  };

  const resetGame = () => {
    setCurrentScreen('start');
  };

  const goToQuiz = () => {
    setCurrentScreen('quiz');
  };

  return (
    <GameStateContext.Provider value={{
      currentScreen,
      currentPhase,
      currentPhaseIndex,
      totalPhases: phasesData.length,
      scores,
      playerAnswers,
      lastSelectedOption,
      startGame,
      submitAnswer,
      nextPhase,
      resetGame,
      goToQuiz
    }}>
      {children}
    </GameStateContext.Provider>
  );
};
