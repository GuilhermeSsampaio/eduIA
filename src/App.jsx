import { useGameState } from './contexts/GameStateContext';
import { StartScreen } from './pages/StartScreen';
import { GameScreen } from './pages/GameScreen';
import { ReportScreen } from './pages/ReportScreen';
import { CreditsScreen } from './pages/CreditsScreen';

function AppContent() {
  const { currentScreen } = useGameState();

  return (
    <>
      {currentScreen === 'start' && <StartScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'report' && <ReportScreen />}
      {currentScreen === 'credits' && <CreditsScreen />}
    </>
  );
}

export default AppContent;
