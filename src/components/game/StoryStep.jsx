export const StoryStep = ({
  story,
  storyPageIndex,
  totalStoryPages,
  onPrev,
  onNext
}) => {
  if (!story) return null;

  return (
    <div className="step-container story-step fade-enter-active">
      <h2 className="story-title">{story.title}</h2>
      
      <div className="page-indicator">
        Página {storyPageIndex + 1} de {totalStoryPages}
      </div>

      <div className="story-card">
        <p className="story-text">{story.pages?.[storyPageIndex]}</p>
      </div>

      <div className="story-nav-buttons">
        {storyPageIndex > 0 && (
          <button className="nav-btn secondary-btn" onClick={onPrev}>
            Anterior
          </button>
        )}
        <button className="nav-btn primary-btn" onClick={onNext}>
          {storyPageIndex < totalStoryPages - 1 ? 'Próxima Página' : 'Ver Fatos Reais'}
        </button>
      </div>
    </div>
  );
};

