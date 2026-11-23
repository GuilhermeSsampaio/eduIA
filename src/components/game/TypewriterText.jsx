import { useEffect, useState } from 'react';
import './TypewriterText.css';

export const TypewriterText = ({
  text = '',
  speed = 18,
  instant = false,
  className = '',
  paragraphClassName = '',
  showSkipButton = true,
  onComplete
}) => {
  const fullText = String(text ?? '');
  const [charCount, setCharCount] = useState(() => (instant ? fullText.length : 0));

  const isDone = charCount >= fullText.length;

  useEffect(() => {
    if (isDone) {
      if (onComplete) onComplete();
      return undefined;
    }

    const intervalId = setInterval(() => {
      setCharCount((prev) => {
        if (prev + 1 >= fullText.length) {
          clearInterval(intervalId);
          return fullText.length;
        }
        return prev + 1;
      });
    }, Math.max(5, Number(speed) || 18));

    return () => clearInterval(intervalId);
  }, [fullText.length, isDone, onComplete, speed]);

  const handleSkip = (event) => {
    if (isDone) return;
    event?.stopPropagation();
    setCharCount(fullText.length);
  };

  const visibleText = fullText.slice(0, charCount);
  const paragraphs = visibleText.split('\n\n');

  return (
    <div
      className={`typewriter-box ${!isDone ? 'typing' : ''} ${className}`.trim()}
      onClick={!isDone ? handleSkip : undefined}
      title={!isDone ? 'Clique para exibir o texto completo' : undefined}
    >
      <div className="typewriter-content">
        {paragraphs.map((paragraph, idx) => {
          const isLastParagraph = idx === paragraphs.length - 1;
          return (
            <p
              key={idx}
              className={`typewriter-paragraph ${paragraphClassName}`.trim()}
            >
              {paragraph}
              {!isDone && isLastParagraph && (
                <span className="typewriter-cursor" aria-hidden="true" />
              )}
            </p>
          );
        })}
      </div>

      {!isDone && showSkipButton && (
        <div className="typewriter-skip-row">
          <button
            type="button"
            className="typewriter-skip-btn"
            onClick={handleSkip}
          >
            Pular animação &raquo;
          </button>
        </div>
      )}
    </div>
  );
};
