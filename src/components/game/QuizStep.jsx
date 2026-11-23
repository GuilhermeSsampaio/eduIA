import { TypewriterText } from './TypewriterText';

const formatSigned = (val) => `${val > 0 ? '+' : ''}${val}`;

const getFeedbackTone = (answer) => {
  if (!answer) return 'neutral';
  if ((answer.scoreCognitive || 0) > 0) return 'positive';
  if ((answer.scoreCognitive || 0) < 0) return 'risky';
  return 'neutral';
};

const getFeedbackHeading = (tone) => {
  if (tone === 'positive') return 'FEEDBACK IMEDIATO • ESCOLHA CONSCIENTE';
  if (tone === 'risky') return 'FEEDBACK IMEDIATO • ESCOLHA ARRISCADA';
  return 'FEEDBACK IMEDIATO • PONTO DE ATENÇÃO';
};

export const QuizStep = ({
  phaseId,
  questionIndex,
  totalQuestions,
  caseText,
  questionText,
  options,
  selectedAnswer = null,
  hasRead = false,
  onMarkRead,
  onSelectOption,
  onBack,
  onNext
}) => {
  const isLastQuestion = questionIndex >= totalQuestions - 1;
  const selectedOptionId = selectedAnswer?.optionId || null;
  const feedbackTone = getFeedbackTone(selectedAnswer);
  const backTitle =
    questionIndex > 0
      ? `Voltar para a Questão ${questionIndex}`
      : 'Voltar para as Fontes';

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
          <TypewriterText
            key={`quiz-case-${phaseId}-${questionIndex}`}
            speed={18}
            text={caseText}
            instant={hasRead}
            paragraphClassName="case-text"
            onComplete={onMarkRead}
          />
        </div>
      )}

      <div className="question-box">
        {caseText ? (
          <h3 className="question-text">{questionText}</h3>
        ) : (
          <TypewriterText
            key={`quiz-q-${phaseId}-${questionIndex}`}
            speed={18}
            text={questionText}
            instant={hasRead}
            paragraphClassName="question-text"
            onComplete={onMarkRead}
          />
        )}
      </div>

      <div className="options-grid">
        {options?.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              type="button"
              key={option.id}
              className={`option-card-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectOption(option)}
              aria-pressed={isSelected}
            >
              <span className="option-id">{option.id}</span>
              <span className="option-text">{option.text}</span>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div
          className={`immediate-feedback-card ${feedbackTone} fade-enter-active`}
          role="status"
          aria-live="polite"
        >
          <div className="immediate-feedback-header">
            <span className="immediate-feedback-tag">
              {getFeedbackHeading(feedbackTone)}
            </span>
            <div className="immediate-impact-badges">
              <span
                className={`impact-pill ${
                  (selectedAnswer.scoreCognitive || 0) >= 0 ? 'good' : 'bad'
                }`}
              >
                Raciocínio {formatSigned(selectedAnswer.scoreCognitive || 0)}
              </span>
              <span
                className={`impact-pill ${
                  (selectedAnswer.scoreTechDependence || 0) <= 0 ? 'good' : 'bad'
                }`}
              >
                Dependência {formatSigned(selectedAnswer.scoreTechDependence || 0)}
              </span>
            </div>
          </div>

          <p className="immediate-feedback-text">{selectedAnswer.feedback}</p>
        </div>
      )}

      <div className="step-nav-actions">
        <button
          type="button"
          className="nav-btn secondary-btn back-step-btn"
          onClick={onBack}
          title={backTitle}
        >
          &lt; Voltar
        </button>

        {selectedAnswer && onNext && (
          <button
            type="button"
            className="nav-btn primary-btn"
            onClick={onNext}
          >
            {isLastQuestion ? 'Continuar para Saldo da Fase' : 'Continuar'}
          </button>
        )}
      </div>
    </div>
  );
};

