import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './ReportScreen.css';

export const ReportScreen = () => {
  const { scores, playerAnswers, resetGame, goToCredits } = useGameState();

  const handleRestart = () => {
    audioService.playClick();
    resetGame();
  };

  const handleCredits = () => {
    audioService.playClick();
    goToCredits();
  };

  const getProfile = () => {
    if (scores.cognitive >= 18) {
      return {
        title: "Mestre do Raciocínio Crítico",
        badge: "AUTONOMIA MÁXIMA",
        desc: "Impressionante! Você utiliza a IA como aliada mantendo total autonomia. Sempre verifica fontes fora da ferramenta, guarda rascunhos e não se deixa enganar por respostas convincentes."
      };
    } else if (scores.cognitive >= 8) {
      return {
        title: "Estudante Consciencioso",
        badge: "BOM SENSO CRÍTICO",
        desc: "Muito bem! Você demonstra autoria e pensamento analítico na maioria dos casos. Lembre-se de nunca perguntar à IA se ela própria está certa!"
      };
    } else if (scores.cognitive >= 0) {
      return {
        title: "Aprendiz de Uso Consciente",
        badge: "EM EVOLUÇÃO",
        desc: "Você já desconfia da IA em algumas situações, mas ainda precisa cultivar o hábito de pensar primeiro e consultar a IA apenas como apoio final."
      };
    } else {
      return {
        title: "Dependente Tecnológico",
        badge: "ATENÇÃO NECESSÁRIA",
        desc: "Cuidado! Você está terceirizando seu aprendizado e raciocínio para a máquina. A IA pode inventar fatos, reproduzir preconceitos e diminuir seu engajamento cerebral."
      };
    }
  };

  const profile = getProfile();

  return (
    <ScreenContainer>
      <div className="report-content fade-enter-active">
        <h2 className="report-title">Relatório de Perfil Digital</h2>
        
        <div className="profile-card">
          <span className="profile-badge-tag">{profile.badge}</span>
          <h3 className="profile-name">{profile.title}</h3>
          <p className="profile-desc">{profile.desc}</p>
        </div>

        <div className="scores-grid">
          <div className="score-box cognitive">
            <span className="score-label">Raciocínio Próprio:</span>
            <span className={`score-value ${scores.cognitive >= 0 ? 'positive' : 'negative'}`}>
              {scores.cognitive > 0 ? '+' : ''}{scores.cognitive} pts
            </span>
          </div>

          <div className="score-box tech-dep">
            <span className="score-label">Dependência de IA:</span>
            <span className={`score-value ${scores.techDependence <= 0 ? 'positive' : 'negative'}`}>
              {scores.techDependence > 0 ? '+' : ''}{scores.techDependence} pts
            </span>
          </div>
        </div>

        {/* History Breakdown */}
        {playerAnswers.length > 0 && (
          <div className="history-section">
            <h4 className="history-title">Resumo das Escolhas por Fase</h4>
            <div className="history-list">
              {playerAnswers.map((item, idx) => (
                <div key={idx} className="history-card">
                  <div className="history-header">
                    <span className="history-phase-num">Fase {idx + 1}</span>
                    <span className="history-phase-theme">{item.theme}</span>
                  </div>
                  <p className="history-choice"><strong>Sua escolha ({item.optionId}):</strong> "{item.optionText}"</p>
                  <p className="history-moral"><em>Moral: {item.moral}</em></p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="disclaimer">
          *Aviso: Este resultado é uma ferramenta de auto-reflexão pedagógica sobre ética, autonomia e uso consciente da Inteligência Artificial.*
        </p>

        <div className="report-actions">
          <button className="restart-btn" onClick={handleRestart}>
            JOGAR NOVAMENTE
          </button>
          
          <button className="credits-btn" onClick={handleCredits}>
            VER CRÉDITOS
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
};
