import { useGameState } from './contexts/GameStateContext';
import { StartScreen } from './pages/StartScreen';
import { GameScreen } from './pages/GameScreen';
import { ReportScreen } from './pages/ReportScreen';

function AppContent() {
  const { currentScreen } = useGameState();

  return (
    <>
      {currentScreen === 'start' && <StartScreen />}
      {(currentScreen === 'presentation' || currentScreen === 'quiz' || currentScreen === 'feedback') && <GameScreen />}
      {currentScreen === 'report' && <ReportScreen />}
    </>
  );
}

export default AppContent;
