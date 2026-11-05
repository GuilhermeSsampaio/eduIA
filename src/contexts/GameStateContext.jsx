import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  // userAnswers[phaseId][questionIndex] = answerRecord
  const [userAnswers, setUserAnswers] = useState({});
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

  // Lista plana de todas as respostas dadas até o momento (ordenada por fase e questão)
  const playerAnswers = useMemo(() => {
    return phasesData.flatMap((phase) => {
      const phaseMap = userAnswers[phase.id];
      if (!phaseMap) return [];
      return Object.keys(phaseMap)
        .sort((a, b) => Number(a) - Number(b))
        .map((qIdx) => phaseMap[qIdx]);
    });
  }, [userAnswers]);

  // Respostas da fase atual (derivadas de userAnswers)
  const currentPhaseAnswers = useMemo(() => {
    if (!currentPhase || !userAnswers[currentPhase.id]) return [];
    const phaseMap = userAnswers[currentPhase.id];
    return Object.keys(phaseMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((qIdx) => phaseMap[qIdx]);
  }, [currentPhase, userAnswers]);

  // Pontuação total derivada dinamicamente via .reduce() sobre userAnswers
  const scores = useMemo(() => {
    return playerAnswers.reduce(
      (acc, ans) => ({
        cognitive: acc.cognitive + (ans.scoreCognitive || 0),
        techDependence: acc.techDependence + (ans.scoreTechDependence || 0)
      }),
      { cognitive: 0, techDependence: 0 }
    );
  }, [playerAnswers]);

  // Zera todo o progresso/pontuação da rodada
  const resetRoundState = () => {
    setCurrentPhaseIndex(0);
    setCurrentQuestionIndex(0);
    setPhaseStep('story');
    setUserAnswers({});
    setLastSelectedOption(null);
  };

  // Inicia ou retoma a jogada de onde o jogador parou
  const startGame = () => {
    setCurrentScreen('game');
  };

  // Volta ao Menu Inicial mantendo o progresso salvo em memória
  const returnToMenu = () => {
    setCurrentScreen('start');
  };

  const nextStoryPage = () => {
    setPhaseStep('sources');
  };

  const goToQuizFromSources = () => {
    setCurrentQuestionIndex(0);
    setPhaseStep('quiz');
  };

  const submitAnswer = (option) => {
    setLastSelectedOption(option);

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

    // Sobrescreve a resposta de [phaseId][questionIndex] sem duplicar pontos
    setUserAnswers(prev => ({
      ...prev,
      [currentPhase.id]: {
        ...(prev[currentPhase.id] || {}),
        [currentQuestionIndex]: answerRecord
      }
    }));

    // Verifica se há mais questões nesta fase
    if (currentQuestionIndex < totalPhaseQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
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
      setPhaseStep('story');
      setLastSelectedOption(null);
    } else {
      setCurrentScreen('report');
    }
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      const targetPhaseIndex = currentPhaseIndex - 1;
      const targetPhase = phasesData[targetPhaseIndex];
      const hasAnsweredTargetPhase =
        targetPhase &&
        userAnswers[targetPhase.id] &&
        Object.keys(userAnswers[targetPhase.id]).length > 0;

      setCurrentPhaseIndex(targetPhaseIndex);
      setCurrentQuestionIndex(0);
      setPhaseStep(hasAnsweredTargetPhase ? 'quiz' : 'story');
      setLastSelectedOption(null);
    }
  };

  // Reset total do jogo (chamado ao reiniciar do Relatório Final ou ao entrar nos Créditos)
  const resetGame = () => {
    resetRoundState();
    setCurrentScreen('start');
  };

  const goToCredits = () => {
    resetRoundState();
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
      userAnswers,
      scores,
      playerAnswers,
      currentPhaseAnswers,
      lastSelectedOption,
      theme,
      toggleTheme,
      startGame,
      returnToMenu,
      nextStoryPage,
      goToQuizFromSources,
      submitAnswer,
      goToMoral,
      nextPhase,
      prevPhase,
      resetGame,
      goToCredits
    }}>
      {children}
    </GameStateContext.Provider>
  );
};
