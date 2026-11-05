export const StoryStep = ({
  story,
  onNext
}) => {
  if (!story) return null;

  return (
    <div className="step-container story-step fade-enter-active">
      <h2 className="story-title">{story.title}</h2>

      <div className="story-card">
        <div className="story-pages-container">
          {story.pages?.map((paragraph, index) => (
            <p key={index} className="story-text">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="story-nav-buttons">
        <button className="nav-btn primary-btn" onClick={onNext}>
          Avançar para Fontes
        </button>
      </div>
    </div>
  );
};
