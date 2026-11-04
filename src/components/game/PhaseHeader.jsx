export const PhaseHeader = ({ 
  currentPhaseIndex, 
  totalPhases, 
  theme, 
  difficulty,
  phaseStep 
}) => {
  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case 'facil':
      case 'iniciante':
        return 'Nível Fácil';
      case 'medio':
      case 'intermediario':
        return 'Nível Médio';
      case 'dificil':
      case 'avancado':
        return 'Nível Difícil';
      default:
        return null;
    }
  };

  const diffLabel = getDifficultyLabel(difficulty);

  return (
    <div className="phase-header">
      <div className="phase-badge">
        FASE {currentPhaseIndex + 1} DE {totalPhases} • {theme?.toUpperCase()}
        {diffLabel && <span className="difficulty-pill"> • {diffLabel.toUpperCase()}</span>}
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
  );
};

