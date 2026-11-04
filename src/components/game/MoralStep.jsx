export const MoralStep = ({
  moral,
  isLastPhase,
  onNextPhase
}) => {
  return (
    <div className="step-container moral-step fade-enter-active">
      <div className="moral-card">
        <h2>MORAL DA HISTÓRIA</h2>
        <p className="moral-text">{moral}</p>
      </div>

      <button className="nav-btn primary-btn action-btn" onClick={onNextPhase}>
        {isLastPhase ? 'Ver Relatório Final' : 'Avançar para a Próxima Fase'}
      </button>
    </div>
  );
};

