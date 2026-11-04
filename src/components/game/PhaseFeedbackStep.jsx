export const PhaseFeedbackStep = ({
  phaseAnswers = [],
  onGoToMoral
}) => {
  const phaseCognitive = phaseAnswers.reduce((acc, curr) => acc + (curr.scoreCognitive || 0), 0);
  const phaseTechDep = phaseAnswers.reduce((acc, curr) => acc + (curr.scoreTechDependence || 0), 0);

  return (
    <div className="step-container phase-feedback-step fade-enter-active">
      <div className="consolidated-feedback-header">
        <span className="feedback-tag">DIAGNÓSTICO DA FASE</span>
        <h2 className="feedback-title">Análise Pedagógica Consolidada</h2>
        <p className="feedback-subtitle">
          Confira abaixo o resultado de cada uma das decisões que você tomou neste estudo de caso:
        </p>
      </div>

      <div className="phase-answers-list">
        {phaseAnswers.map((item, index) => (
          <div key={index} className="consolidated-card">
            <div className="card-question-header">
              <span className="question-num-pill">Questão {index + 1} de {phaseAnswers.length}</span>
              <p className="card-question-text">{item.questionText}</p>
            </div>

            <div className="selected-choice-preview">
              <span className="preview-label">Sua Escolha ({item.optionId}):</span>
              <p className="preview-text">"{item.optionText}"</p>
            </div>

            <div className="feedback-card-inner">
              <h4 className="inner-feedback-title">Avaliação Crítica:</h4>
              <p className="feedback-content">{item.feedback}</p>

              <div className="impact-badges">
                <div className={`score-tag ${item.scoreCognitive >= 0 ? 'positive' : 'negative'}`}>
                  Raciocínio Próprio: {item.scoreCognitive > 0 ? '+' : ''}{item.scoreCognitive}
                </div>
                <div className={`score-tag ${item.scoreTechDependence <= 0 ? 'positive' : 'negative'}`}>
                  Dependência da IA: {item.scoreTechDependence > 0 ? '+' : ''}{item.scoreTechDependence}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saldo da Fase */}
      <div className="phase-score-summary">
        <span className="summary-title">Saldo desta Fase:</span>
        <div className="impact-badges">
          <div className={`score-tag ${phaseCognitive >= 0 ? 'positive' : 'negative'}`}>
            Raciocínio Total: {phaseCognitive > 0 ? '+' : ''}{phaseCognitive} pts
          </div>
          <div className={`score-tag ${phaseTechDep <= 0 ? 'positive' : 'negative'}`}>
            Dependência de IA: {phaseTechDep > 0 ? '+' : ''}{phaseTechDep} pts
          </div>
        </div>
      </div>

      <button className="nav-btn primary-btn action-btn" onClick={onGoToMoral}>
        Ver Moral da História
      </button>
    </div>
  );
};

