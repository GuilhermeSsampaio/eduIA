import { createContext, useContext, useState } from 'react';
import rawPhasesData from '../data/phases.json';

const phasesData = rawPhasesData.phases || rawPhasesData;

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'game', 'report'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseStep, setPhaseStep] = useState('story'); // 'story', 'sources', 'quiz', 'feedback', 'moral'
  const [storyPageIndex, setStoryPageIndex] = useState(0);
  const [scores, setScores] = useState({ cognitive: 0, techDependence: 0 });
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [lastSelectedOption, setLastSelectedOption] = useState(null);

  const currentPhase = phasesData[currentPhaseIndex];

  const startGame = () => {
    setCurrentScreen('game');
    setCurrentPhaseIndex(0);
    setPhaseStep('story');
    setStoryPageIndex(0);
    setScores({ cognitive: 0, techDependence: 0 });
    setPlayerAnswers([]);
    setLastSelectedOption(null);
  };

  const nextStoryPage = () => {
    if (currentPhase && storyPageIndex < currentPhase.story.pages.length - 1) {
      setStoryPageIndex(prev => prev + 1);
    } else {
      setPhaseStep('sources');
    }
  };

  const prevStoryPage = () => {
    if (storyPageIndex > 0) {
      setStoryPageIndex(prev => prev - 1);
    }
  };

  const goToQuizFromSources = () => {
    setPhaseStep('quiz');
  };

  const submitAnswer = (option) => {
    setLastSelectedOption(option);
    
    // Update scores
    setScores(prev => ({
      cognitive: prev.cognitive + option.scoreCognitive,
      techDependence: prev.techDependence + option.scoreTechDependence
    }));
    
    // Save history
    setPlayerAnswers(prev => [...prev, { 
      phaseId: currentPhase.id, 
      theme: currentPhase.theme,
      optionId: option.id,
      optionText: option.text,
      feedback: option.feedback,
      moral: currentPhase.moral
    }]);
    
    // Go to feedback screen
    setPhaseStep('feedback');
  };

  const goToMoral = () => {
    setPhaseStep('moral');
  };

  const nextPhase = () => {
    if (currentPhaseIndex + 1 < phasesData.length) {
      setCurrentPhaseIndex(prev => prev + 1);
      setPhaseStep('story');
      setStoryPageIndex(0);
      setLastSelectedOption(null);
    } else {
      setCurrentScreen('report');
    }
  };

  const resetGame = () => {
    setCurrentScreen('start');
  };

  const goToCredits = () => {
    setCurrentScreen('credits');
  };

  return (
    <GameStateContext.Provider value={{
      currentScreen,
      currentPhase,
      currentPhaseIndex,
      totalPhases: phasesData.length,
      phaseStep,
      storyPageIndex,
      totalStoryPages: currentPhase?.story?.pages?.length || 0,
      scores,
      playerAnswers,
      lastSelectedOption,
      startGame,
      nextStoryPage,
      prevStoryPage,
      goToQuizFromSources,
      submitAnswer,
      goToMoral,
      nextPhase,
      resetGame,
      goToCredits
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

