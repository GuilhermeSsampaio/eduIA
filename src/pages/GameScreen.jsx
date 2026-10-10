import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './GameScreen.css';

export const GameScreen = () => {
  const { 
    currentPhase, 
    currentPhaseIndex,
    totalPhases,
    phaseStep,
    storyPageIndex,
    totalStoryPages,
    lastSelectedOption,
    nextStoryPage,
    prevStoryPage,
    goToQuizFromSources,
    submitAnswer,
    goToMoral,
    nextPhase 
  } = useGameState();

  const handleNextStory = () => {
    audioService.playClick();
    nextStoryPage();
  };

  const handlePrevStory = () => {
    audioService.playClick();
    prevStoryPage();
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

  return (
    <ScreenContainer>
      {/* Top Header & Breadcrumb Progress */}
      <div className="phase-header">
        <div className="phase-badge">
          FASE {currentPhaseIndex + 1} DE {totalPhases} • {currentPhase.theme.toUpperCase()}
        </div>

        <div className="step-breadcrumbs">
          <span className={`crumb ${phaseStep === 'story' ? 'active' : ''}`}>1. História</span>
          <span className="crumb-sep">›</span>
          <span className={`crumb ${phaseStep === 'sources' ? 'active' : ''}`}>2. Fontes</span>
          <span className="crumb-sep">›</span>
          <span className={`crumb ${phaseStep === 'quiz' ? 'active' : ''}`}>3. Desafio</span>
          <span className="crumb-sep">›</span>
          <span className={`crumb ${phaseStep === 'feedback' ? 'active' : ''}`}>4. Feedback</span>
          <span className="crumb-sep">›</span>
          <span className={`crumb ${phaseStep === 'moral' ? 'active' : ''}`}>5. Moral</span>
        </div>
      </div>

      {/* STEP 1: STORY PAGES */}
      {phaseStep === 'story' && (
        <div className="step-container story-step fade-enter-active">
          <h2 className="story-title">{currentPhase.story.title}</h2>
          
          <div className="page-indicator">
            Página {storyPageIndex + 1} de {totalStoryPages}
          </div>

          <div className="story-card">
            <p className="story-text">{currentPhase.story.pages[storyPageIndex]}</p>
          </div>

          <div className="story-nav-buttons">
            {storyPageIndex > 0 && (
              <button className="nav-btn secondary-btn" onClick={handlePrevStory}>
                Anterior
              </button>
            )}
            <button className="nav-btn primary-btn" onClick={handleNextStory}>
              {storyPageIndex < totalStoryPages - 1 ? 'Próxima Página' : 'Ver Fatos Reais'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SOURCES (Baseado em fatos reais) */}
      {phaseStep === 'sources' && (
        <div className="step-container sources-step fade-enter-active">
          <div className="real-facts-seal">
            <span className="seal-text">BASEADO EM FATOS REAIS</span>
          </div>

          <h3 className="sources-subtitle">Caso real de referência: "{currentPhase.story.title}"</h3>

          <div className="sources-list">
            {currentPhase.sources.map((src, index) => (
              <div key={index} className="source-card">
                <div className="source-meta">
                  <span className="outlet-badge">{src.outlet}</span>
                  {src.date && <span className="date-badge">{src.date}</span>}
                </div>
                <h4 className="source-title">{src.title}</h4>
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="source-link"
                >
                  Ler matéria original
                </a>
              </div>
            ))}
          </div>

          <button className="nav-btn primary-btn action-btn" onClick={handleGoToQuiz}>
            Ir para o Desafio Prático
          </button>
        </div>
      )}

      {/* STEP 3: CASE TEXT + QUESTION + OPTIONS */}
      {phaseStep === 'quiz' && (
        <div className="step-container quiz-step fade-enter-active">
          <div className="case-box">
            <span className="case-tag">SITUAÇÃO PRÁTICA</span>
            <p className="case-text">{currentPhase.caseText}</p>
          </div>

          <div className="question-box">
            <h3 className="question-text">{currentPhase.question}</h3>
          </div>

          <div className="options-grid">
            {currentPhase.options.map((option) => (
              <button
                key={option.id}
                className="option-card-btn"
                onClick={() => handleOptionClick(option)}
              >
                <span className="option-id">{option.id}</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: FEEDBACK */}
      {phaseStep === 'feedback' && lastSelectedOption && (
        <div className="step-container feedback-step fade-enter-active">
          <div className="selected-choice-preview">
            <span className="preview-label">Sua Escolha ({lastSelectedOption.id}):</span>
            <p className="preview-text">"{lastSelectedOption.text}"</p>
          </div>

          <div className="feedback-card">
            <h3>Análise Pedagógica</h3>
            <p className="feedback-content">{lastSelectedOption.feedback}</p>

            <div className="impact-badges">
              <div className={`score-tag ${lastSelectedOption.scoreCognitive >= 0 ? 'positive' : 'negative'}`}>
                Raciocínio Próprio: {lastSelectedOption.scoreCognitive > 0 ? '+' : ''}{lastSelectedOption.scoreCognitive}
              </div>
              <div className={`score-tag ${lastSelectedOption.scoreTechDependence <= 0 ? 'positive' : 'negative'}`}>
                Dependência da IA: {lastSelectedOption.scoreTechDependence > 0 ? '+' : ''}{lastSelectedOption.scoreTechDependence}
              </div>
            </div>
          </div>

          <button className="nav-btn primary-btn action-btn" onClick={handleGoToMoral}>
            Ver Moral da História
          </button>
        </div>
      )}

      {/* STEP 5: MORAL */}
      {phaseStep === 'moral' && (
        <div className="step-container moral-step fade-enter-active">
          <div className="moral-card">
            <h2>MORAL DA HISTÓRIA</h2>
            <p className="moral-text">{currentPhase.moral}</p>
          </div>

          <button className="nav-btn primary-btn action-btn" onClick={handleNextPhase}>
            {currentPhaseIndex < totalPhases - 1 ? 'Avançar para a Próxima Fase' : 'Ver Relatório Final'}
          </button>
        </div>
      )}
    </ScreenContainer>
  );
};
