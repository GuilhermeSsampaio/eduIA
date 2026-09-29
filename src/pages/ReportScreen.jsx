import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './ReportScreen.css';

export const ReportScreen = () => {
  const { scores, resetGame } = useGameState();

  const handleRestart = () => {
    audioService.playClick();
    resetGame();
  };

  const getProfile = () => {
    if (scores.cognitive >= 6 && scores.techDependence <= -2) {
      return {
        title: "Mestre Analítico",
        desc: "Você utiliza a IA com maestria, mantendo total controle e pensamento crítico."
      };
    } else if (scores.cognitive >= 0 && scores.techDependence >= 0) {
      return {
        title: "Estudante Equilibrado",
        desc: "Você sabe usar a IA, mas às vezes confia demais. Lembre-se de sempre checar as fontes!"
      };
    } else {
      return {
        title: "Dependente Tecnológico",
        desc: "Cuidado! Você está delegando seu raciocínio para a máquina. A IA é uma ferramenta, não a resposta definitiva."
      };
    }
  };

  const profile = getProfile();

  return (
    <ScreenContainer>
      <div className="report-content">
        <h2 className="report-title">Relatório de Perfil</h2>
        
        <div className="profile-card">
          <h3 className="profile-name">{profile.title}</h3>
          <p className="profile-desc">{profile.desc}</p>
        </div>

        <div className="scores-grid">
          <div className="score-box">
            <span className="score-label">Raciocínio Analítico:</span>
            <span className={`score-value ${scores.cognitive > 0 ? 'positive' : 'negative'}`}>
              {scores.cognitive > 0 ? '+' : ''}{scores.cognitive}
            </span>
          </div>
          <div className="score-box">
            <span className="score-label">Dependência Tecnológica:</span>
            <span className={`score-value ${scores.techDependence > 0 ? 'negative' : 'positive'}`}>
              {scores.techDependence > 0 ? '+' : ''}{scores.techDependence}
            </span>
          </div>
        </div>

        <p className="disclaimer">
          *Este resultado é uma ferramenta de auto-reflexão pedagógica.*
        </p>

        <button className="restart-btn" onClick={handleRestart}>
          JOGAR NOVAMENTE
        </button>
      </div>
    </ScreenContainer>
  );
};
