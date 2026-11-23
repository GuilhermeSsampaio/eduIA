export const SourcesStep = ({
  storyTitle,
  sources,
  onBack,
  onGoToQuiz
}) => {
  return (
    <div className="step-container sources-step fade-enter-active">
      <div className="real-facts-seal">
        <span className="seal-text">BASEADO EM FATOS REAIS</span>
      </div>

      <h3 className="sources-subtitle">Caso real de referência: "{storyTitle}"</h3>

      <div className="sources-list">
        {sources?.map((src, index) => (
          <a
            key={index}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card"
          >
            <div className="source-meta">
              <span className="outlet-badge">{src.outlet}</span>
              {src.date && <span className="date-badge">{src.date}</span>}
            </div>
            <h4 className="source-title">{src.title}</h4>
            <span className="source-link">
              Ler matéria original
            </span>
          </a>
        ))}
      </div>

      <div className="step-nav-actions">
        <button
          type="button"
          className="nav-btn secondary-btn back-step-btn"
          onClick={onBack}
          title="Voltar para a História"
        >
          &lt; Voltar
        </button>
        <button
          type="button"
          className="nav-btn primary-btn"
          onClick={onGoToQuiz}
        >
          Ir para o Desafio Prático
        </button>
      </div>
    </div>
  );
};
