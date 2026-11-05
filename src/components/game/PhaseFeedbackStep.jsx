export const PhaseFeedbackStep = ({
  phaseAnswers = [],
  onGoToMoral
}) => {
  const phaseCognitive = phaseAnswers.reduce((acc, curr) => acc + (curr.scoreCognitive || 0), 0);
  const phaseTechDep = phaseAnswers.reduce((acc, curr) => acc + (curr.scoreTechDependence || 0), 0);

  return (
    <div className="step-container phase-feedback-step fade-enter-active">
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
