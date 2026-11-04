export const SourcesStep = ({
  storyTitle,
  sources,
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

      <button className="nav-btn primary-btn action-btn" onClick={onGoToQuiz}>
        Ir para o Desafio Prático
      </button>
    </div>
  );
};

