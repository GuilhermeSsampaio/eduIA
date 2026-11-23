import { TypewriterText } from './TypewriterText';

export const StoryStep = ({
  phaseId,
  story,
  hasRead = false,
  onMarkRead,
  onNext
}) => {
  if (!story) return null;

  const fullStoryText = Array.isArray(story.pages)
    ? story.pages.join('\n\n')
    : '';

  return (
    <div className="step-container story-step fade-enter-active">
      <h2 className="story-title">{story.title}</h2>

      {story.image && (
        <div className="story-illustration-wrap">
          <img
            src={story.image}
            alt={story.imageAlt || `Ilustração da história: ${story.title}`}
            className="story-illustration"
            draggable="false"
          />
        </div>
      )}

      <div className="story-card">
        <div className="story-pages-container">
          <TypewriterText
            key={`story-${phaseId}`}
            speed={18}
            text={fullStoryText}
            instant={hasRead}
            paragraphClassName="story-text"
            onComplete={onMarkRead}
          />
        </div>
      </div>

      <div className="story-nav-buttons">
        <button type="button" className="nav-btn primary-btn" onClick={onNext}>
          Avançar para Fontes
        </button>
      </div>
    </div>
  );
};
