import { Fragment } from 'react';

const STEP_ITEMS = [
  { key: 'story', label: '1. História' },
  { key: 'sources', label: '2. Fontes' },
  { key: 'quiz', label: '3. Desafio' },
  { key: 'feedback', label: '4. Feedback' },
  { key: 'moral', label: '5. Moral' }
];

export const PhaseHeader = ({ 
  currentPhaseIndex, 
  totalPhases, 
  theme, 
  difficulty,
  phaseStep,
  maxReachedStepIndex = 0,
  onSelectStep
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

      <nav className="step-breadcrumbs" aria-label="Progresso das etapas da fase">
        {STEP_ITEMS.map((step, index) => {
          const isActive = phaseStep === step.key;
          const isReachable = index <= maxReachedStepIndex;

          return (
            <Fragment key={step.key}>
              {index > 0 && <span className="crumb-sep" aria-hidden="true">›</span>}
              {isReachable && onSelectStep ? (
                <button
                  type="button"
                  className={`crumb crumb-btn ${isActive ? 'active' : 'reachable'}`}
                  onClick={() => {
                    if (!isActive) onSelectStep(step.key);
                  }}
                  aria-current={isActive ? 'step' : undefined}
                  title={isActive ? `Etapa atual: ${step.label}` : `Ir para ${step.label}`}
                >
                  {step.label}
                </button>
              ) : (
                <span className={`crumb ${isActive ? 'active' : 'locked'}`}>
                  {step.label}
                </span>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
};

