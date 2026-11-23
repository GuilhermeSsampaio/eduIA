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

const PHASE_STEPS = ['story', 'sources', 'quiz', 'feedback', 'moral'];

const maxPossibleScores = phasesData.reduce(
  (acc, phase) => {
    (phase.questions || []).forEach((q) => {
      const opts = q.options || [];
      if (opts.length === 0) return;
      const maxCog = Math.max(...opts.map((o) => o.scoreCognitive || 0), 0);
      const maxDep = Math.max(...opts.map((o) => o.scoreTechDependence || 0), 0);
      acc.cognitive += maxCog;
      acc.techDependence += maxDep;
    });
    return acc;
  },
  { cognitive: 0, techDependence: 0 }
);

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'game', 'report', 'credits'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phaseStep, setPhaseStep] = useState('story'); // 'story', 'sources', 'quiz', 'feedback', 'moral'
  // Maior índice de etapa alcançado por fase: { [phaseId]: 0..4 }
  const [maxReachedStepByPhase, setMaxReachedStepByPhase] = useState({});
  // Telas já lidas (para não repetir a animação typewriter ao revisitar)
  const [readScreens, setReadScreens] = useState({});
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

  const markStepReached = (phaseId, stepKey) => {
    if (!phaseId) return;
    const stepIdx = PHASE_STEPS.indexOf(stepKey);
    if (stepIdx === -1) return;
    setMaxReachedStepByPhase((prev) => ({
      ...prev,
      [phaseId]: Math.max(prev[phaseId] ?? 0, stepIdx)
    }));
  };

  const currentStepIndex = PHASE_STEPS.indexOf(phaseStep);
  const maxReachedStepIndex = Math.max(
    currentStepIndex,
    maxReachedStepByPhase[currentPhase?.id] ?? 0
  );

  const markScreenRead = (screenKey) => {
    if (!screenKey) return;
    setReadScreens((prev) => (prev[screenKey] ? prev : { ...prev, [screenKey]: true }));
  };

  // Zera todo o progresso/pontuação da rodada
  const resetRoundState = () => {
    setCurrentPhaseIndex(0);
    setCurrentQuestionIndex(0);
    setPhaseStep('story');
    setMaxReachedStepByPhase({});
    setReadScreens({});
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
    markScreenRead(`story-${currentPhase?.id}`);
    markStepReached(currentPhase?.id, 'sources');
    setPhaseStep('sources');
  };

  const goToQuizFromSources = () => {
    markStepReached(currentPhase?.id, 'quiz');
    setCurrentQuestionIndex((prev) =>
      prev >= 0 && prev < totalPhaseQuestions ? prev : 0
    );
    setPhaseStep('quiz');
  };

  const goToPhaseStep = (targetStep) => {
    const targetIdx = PHASE_STEPS.indexOf(targetStep);
    if (targetIdx === -1 || targetIdx > maxReachedStepIndex) return;
    setPhaseStep(targetStep);
  };

  const goBackFromSources = () => {
    setPhaseStep('story');
  };

  const goBackInQuiz = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setPhaseStep('sources');
    }
  };

  const goNextInQuiz = () => {
    if (currentQuestionIndex < totalPhaseQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      markStepReached(currentPhase?.id, 'feedback');
      setPhaseStep('feedback');
    }
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

    markScreenRead(`quiz-${currentPhase.id}-${currentQuestionIndex}`);
  };

  const goToMoral = () => {
    markStepReached(currentPhase?.id, 'moral');
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

      const targetStep = hasAnsweredTargetPhase ? 'quiz' : 'story';
      markStepReached(targetPhase?.id, targetStep);
      setCurrentPhaseIndex(targetPhaseIndex);
      setCurrentQuestionIndex(0);
      setPhaseStep(targetStep);
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
      maxReachedStepIndex,
      readScreens,
      markScreenRead,
      userAnswers,
      scores,
      maxScores: maxPossibleScores,
      playerAnswers,
      currentPhaseAnswers,
      lastSelectedOption,
      theme,
      toggleTheme,
      startGame,
      returnToMenu,
      nextStoryPage,
      goToQuizFromSources,
      goToPhaseStep,
      goBackFromSources,
      goBackInQuiz,
      goNextInQuiz,
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
