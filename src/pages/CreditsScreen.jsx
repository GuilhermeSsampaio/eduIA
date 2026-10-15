import { useGameState } from '../contexts/GameStateContext';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { audioService } from '../services/AudioService';
import './CreditsScreen.css';

export const CreditsScreen = () => {
  const { resetGame } = useGameState();

  const handleReturn = () => {
    audioService.playClick();
    resetGame();
  };

  return (
    <ScreenContainer className="credits-screen" lockViewport>
      <div className="credits-content fade-enter-active">
        <h2 className="credits-title">Créditos do Jogo</h2>
        
        <div className="credits-card">
          <span className="credits-badge">PROJETO SGDD - EDUAI</span>
          
          <div className="authors-section">
            <h3>Autores e Desenvolvedores:</h3>
            <ul className="authors-list">
              <li><strong>Guilherme Silva Sampaio</strong></li>
              <li><strong>Pedro Henrique Gonçalves Mota</strong></li>
            </ul>
          </div>

          <div className="credits-details">
            <p><strong>Objetivo Pedagógico:</strong> Proporcionar uma jornada de tomada de decisão e conscientização sobre ética, autoria e uso crítico da IA Generativa na Educação.</p>
            <p><strong>Arte e Interface:</strong> Estética retrô inspirada em Pixel Art, construída inteiramente com CSS (bordas, sombras, cores e animações), sem o uso de imagens ou assets gráficos de terceiros.</p>
            <p><strong>Som e Música:</strong> Desenvolvido inteiramente com a Web Audio API (trilha ambiente, efeitos sonoros e controle de Mute/Unmute), sem o uso de arquivos de áudio externos.</p>
            <p><strong>Tecnologia:</strong> Desenvolvido com React + Vite.</p>
          </div>
        </div>

        <button className="return-btn" onClick={handleReturn}>
          VOLTAR AO MENU INICIAL
        </button>
      </div>
    </ScreenContainer>
  );
};
