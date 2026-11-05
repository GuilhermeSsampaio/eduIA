import { createContext, useContext, useState, useEffect } from 'react';
import rawPhasesData from '../data/phases.json';

const rawPhasesList = rawPhasesData.phases || rawPhasesData;

const normalizePhase = (phase) => {
  if (!phase) return null;
  const questions = Array.isArray(phase.questions) && phase.questions.length > 0
    ? phase.questions
    : [
        {
          id: 1,
          caseText: phase.caseText,
          question: phase.question,
          options: phase.options || []
        }
      ];

  return {
    ...phase,
    questions
  };
};

const phasesData = rawPhasesList.map(normalizePhase);

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'game', 'report', 'credits'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseStep, setPhaseStep] = useState('story'); // 'story', 'sources', 'quiz', 'feedback', 'moral'
  const [scores, setScores] = useState({ cognitive: 0, techDependence: 0 });
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [currentPhaseAnswers, setCurrentPhaseAnswers] = useState([]);
  const [lastSelectedOption, setLastSelectedOption] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentPhase = phasesData[currentPhaseIndex];
  const currentQuestion = currentPhase?.questions?.[currentQuestionIndex] || currentPhase?.questions?.[0] || null;
  const totalPhaseQuestions = currentPhase?.questions?.length || 0;

  // Zera todo o progresso/pontuação da rodada atual
  const resetRoundState = () => {
    setCurrentPhaseIndex(0);
    setCurrentQuestionIndex(0);
    setCurrentPhaseAnswers([]);
    setPhaseStep('story');
    setScores({ cognitive: 0, techDependence: 0 });
    setPlayerAnswers([]);
    setLastSelectedOption(null);
  };

  const startGame = () => {
    resetRoundState();
    setCurrentScreen('game');
  };

  const nextStoryPage = () => {
    setPhaseStep('sources');
  };

  const goToQuizFromSources = () => {
    setCurrentQuestionIndex(0);
    setCurrentPhaseAnswers([]);
    setPhaseStep('quiz');
  };

  const submitAnswer = (option) => {
    setLastSelectedOption(option);
    
    // Update scores
    setScores(prev => ({
      cognitive: prev.cognitive + option.scoreCognitive,
      techDependence: prev.techDependence + option.scoreTechDependence
    }));
    
    const answerRecord = { 
      phaseId: currentPhase.id, 
      phaseTitle: currentPhase.story?.title || currentPhase.theme,
      theme: currentPhase.theme,
      difficulty: currentPhase.difficulty || 'normal',
      questionIndex: currentQuestionIndex,
      questionId: currentQuestion?.id || currentQuestionIndex + 1,
      caseText: currentQuestion?.caseText || currentPhase.caseText,
      questionText: currentQuestion?.question || currentPhase.question,
      optionId: option.id,
      optionText: option.text,
      feedback: option.feedback,
      scoreCognitive: option.scoreCognitive,
      scoreTechDependence: option.scoreTechDependence,
      moral: currentPhase.moral
    };

    // Save current phase answer and overall history
    setCurrentPhaseAnswers(prev => [...prev, answerRecord]);
    setPlayerAnswers(prev => [...prev, answerRecord]);
    
    // Check if there are more questions in this phase
    if (currentQuestionIndex < totalPhaseQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Continua no quiz para responder a próxima pergunta sem interrupção de feedback
    } else {
      // Final da última pergunta da fase: abre o feedback consolidado
      setPhaseStep('feedback');
    }
  };

  const goToMoral = () => {
    setPhaseStep('moral');
  };

  const nextPhase = () => {
    if (currentPhaseIndex + 1 < phasesData.length) {
      setCurrentPhaseIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setCurrentPhaseAnswers([]);
      setPhaseStep('story');
      setLastSelectedOption(null);
    } else {
      setCurrentScreen('report');
    }
  };

  const resetGame = () => {
    resetRoundState();
    setCurrentScreen('start');
  };

  const goToCredits = () => {
    setCurrentScreen('credits');
  };

  return (
    <GameStateContext.Provider value={{
      currentScreen,
      currentPhase,
      currentQuestion,
      currentPhaseIndex,
      currentQuestionIndex,
      totalPhases: phasesData.length,
      totalPhaseQuestions,
      phaseStep,
      scores,
      playerAnswers,
      currentPhaseAnswers,
      lastSelectedOption,
      theme,
      toggleTheme,
      startGame,
      nextStoryPage,
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
