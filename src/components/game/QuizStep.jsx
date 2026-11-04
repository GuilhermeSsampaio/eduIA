export const QuizStep = ({
  questionIndex,
  totalQuestions,
  caseText,
  questionText,
  options,
  onSelectOption
}) => {
  return (
    <div className="step-container quiz-step fade-enter-active">
      <div className="quiz-progress-bar">
        <span className="quiz-progress-badge">
          QUESTÃO {questionIndex + 1} DE {totalQuestions}
        </span>
        {totalQuestions > 1 && (
          <div className="quiz-dots">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <span 
                key={idx} 
                className={`quiz-dot ${idx === questionIndex ? 'active' : ''} ${idx < questionIndex ? 'completed' : ''}`}
                title={`Questão ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {caseText && (
        <div className="case-box">
          <span className="case-tag">SITUAÇÃO PRÁTICA</span>
          <p className="case-text">{caseText}</p>
        </div>
      )}

      <div className="question-box">
        <h3 className="question-text">{questionText}</h3>
      </div>

      <div className="options-grid">
        {options?.map((option) => (
          <button
            key={option.id}
            className="option-card-btn"
            onClick={() => onSelectOption(option)}
          >
            <span className="option-id">{option.id}</span>
            <span className="option-text">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

