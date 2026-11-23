import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import { PhaseHeader } from '../components/game/PhaseHeader';
import { ScoreHud } from '../components/game/ScoreHud';
import { StoryStep } from '../components/game/StoryStep';
import { SourcesStep } from '../components/game/SourcesStep';
import { QuizStep } from '../components/game/QuizStep';
import { PhaseFeedbackStep } from '../components/game/PhaseFeedbackStep';
import { MoralStep } from '../components/game/MoralStep';
import './GameScreen.css';

export const GameScreen = () => {
  const { 
    currentPhase, 
    currentQuestion,
    currentPhaseIndex,
    currentQuestionIndex,
    totalPhases,
    totalPhaseQuestions,
    phaseStep,
    maxReachedStepIndex,
    readScreens,
    markScreenRead,
    userAnswers,
    maxScores,
    currentPhaseAnswers,
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
    returnToMenu
  } = useGameState();

  const handleNextStory = () => {
    audioService.playClick();
    nextStoryPage();
  };

  const handleGoToQuiz = () => {
    audioService.playClick();
    goToQuizFromSources();
  };

  const handleSelectStep = (targetStep) => {
    audioService.playClick();
    goToPhaseStep(targetStep);
  };

  const handleBackFromSources = () => {
    audioService.playClick();
    goBackFromSources();
  };

  const handleBackInQuiz = () => {
    audioService.playClick();
    goBackInQuiz();
  };

  const handleNextInQuiz = () => {
    audioService.playClick();
    goNextInQuiz();
  };

  const handleOptionClick = (option) => {
    audioService.playConfirm();
    submitAnswer(option);
  };

  const handleGoToMoral = () => {
    audioService.playClick();
    goToMoral();
  };

  const handleNextPhase = () => {
    audioService.playClick();
    nextPhase();
  };

  const handleBackToMenu = () => {
    audioService.playClick();
    returnToMenu();
  };

  const handlePrevPhase = () => {
    audioService.playClick();
    prevPhase();
  };

  const savedAnswer =
    userAnswers[currentPhase?.id]?.[currentQuestionIndex] || null;
  const storyReadKey = `story-${currentPhase?.id}`;
  const quizReadKey = `quiz-${currentPhase?.id}-${currentQuestionIndex}`;
  const hasReadStory = Boolean(readScreens[storyReadKey]);
  const hasReadQuiz = Boolean(readScreens[quizReadKey] || savedAnswer);

  const backButton = (
    <>
      <button
        className="back-menu-btn"
        onClick={handleBackToMenu}
        title="Voltar ao menu (seu progresso ficará salvo temporariamente)"
        aria-label="Voltar ao menu"
      >
        <span className="back-menu-icon" aria-hidden="true">&lt;</span>
        <span>Voltar ao Menu</span>
      </button>

      {currentPhaseIndex > 0 && (
        <button
          className="back-menu-btn prev-phase-btn"
          onClick={handlePrevPhase}
          title="Voltar para a fase anterior e refazer suas escolhas"
          aria-label="Fase anterior"
        >
          <span className="back-menu-icon" aria-hidden="true">&lt;</span>
          <span>Fase Anterior</span>
        </button>
      )}
    </>
  );

  return (
    <ScreenContainer topLeft={backButton}>
      <PhaseHeader 
        currentPhaseIndex={currentPhaseIndex}
        totalPhases={totalPhases}
        theme={currentPhase.theme}
        difficulty={currentPhase.difficulty}
        phaseStep={phaseStep}
        maxReachedStepIndex={maxReachedStepIndex}
        onSelectStep={handleSelectStep}
      />

      <ScoreHud
        userAnswers={userAnswers}
        maxScores={maxScores}
      />

      {phaseStep === 'story' && (
        <StoryStep 
          phaseId={currentPhase.id}
          story={currentPhase.story}
          hasRead={hasReadStory}
          onMarkRead={() => markScreenRead(storyReadKey)}
          onNext={handleNextStory}
        />
      )}

      {phaseStep === 'sources' && (
        <SourcesStep 
          storyTitle={currentPhase.story?.title}
          sources={currentPhase.sources}
          onBack={handleBackFromSources}
          onGoToQuiz={handleGoToQuiz}
        />
      )}

      {phaseStep === 'quiz' && (
        <QuizStep 
          phaseId={currentPhase.id}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalPhaseQuestions}
          caseText={currentQuestion?.caseText || currentPhase.caseText}
          questionText={currentQuestion?.question || currentPhase.question}
          options={currentQuestion?.options || currentPhase.options}
          selectedAnswer={savedAnswer}
          hasRead={hasReadQuiz}
          onMarkRead={() => markScreenRead(quizReadKey)}
          onSelectOption={handleOptionClick}
          onBack={handleBackInQuiz}
          onNext={handleNextInQuiz}
        />
      )}

      {phaseStep === 'feedback' && (
        <PhaseFeedbackStep 
          phaseAnswers={currentPhaseAnswers}
          onGoToMoral={handleGoToMoral}
        />
      )}

      {phaseStep === 'moral' && (
        <MoralStep 
          moral={currentPhase.moral}
          isLastPhase={currentPhaseIndex >= totalPhases - 1}
          onNextPhase={handleNextPhase}
        />
      )}
    </ScreenContainer>
  );
};
