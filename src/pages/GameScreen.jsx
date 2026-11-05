import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import { PhaseHeader } from '../components/game/PhaseHeader';
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
    currentPhaseAnswers,
    nextStoryPage,
    goToQuizFromSources,
    submitAnswer,
    goToMoral,
    nextPhase,
    resetGame
  } = useGameState();

  const handleNextStory = () => {
    audioService.playClick();
    nextStoryPage();
  };

  const handleGoToQuiz = () => {
    audioService.playClick();
    goToQuizFromSources();
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
    resetGame();
  };

  const backButton = (
    <button
      className="back-menu-btn"
      onClick={handleBackToMenu}
      title="Voltar ao menu (o progresso da rodada será perdido)"
      aria-label="Voltar ao menu"
    >
      <span className="back-menu-icon" aria-hidden="true">&lt;</span>
      <span>Voltar ao Menu</span>
    </button>
  );

  return (
    <ScreenContainer topLeft={backButton}>
      <PhaseHeader 
        currentPhaseIndex={currentPhaseIndex}
        totalPhases={totalPhases}
        theme={currentPhase.theme}
        difficulty={currentPhase.difficulty}
        phaseStep={phaseStep}
      />

      {phaseStep === 'story' && (
        <StoryStep 
          story={currentPhase.story}
          onNext={handleNextStory}
        />
      )}

      {phaseStep === 'sources' && (
        <SourcesStep 
          storyTitle={currentPhase.story?.title}
          sources={currentPhase.sources}
          onGoToQuiz={handleGoToQuiz}
        />
      )}

      {phaseStep === 'quiz' && (
        <QuizStep 
          questionIndex={currentQuestionIndex}
          totalQuestions={totalPhaseQuestions}
          caseText={currentQuestion?.caseText || currentPhase.caseText}
          questionText={currentQuestion?.question || currentPhase.question}
          options={currentQuestion?.options || currentPhase.options}
          onSelectOption={handleOptionClick}
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
