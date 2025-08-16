import React from 'react';
import GameHeader from './GameHeader';
import ModeSelector from './ModeSelector';
import { GameMode, UserStats } from './types';
import './ModeSelectionScreen.css';

interface ModeSelectionScreenProps {
  gameModes: GameMode[];
  selectedMode: string;
  userStats: UserStats;
  onModeSelect: (modeId: string) => void;
  onStartGame: () => void;
  onBack?: () => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  gameModes,
  selectedMode,
  userStats,
  onModeSelect,
  onStartGame,
  onBack
}) => {
  const isStartButtonEnabled = selectedMode !== '';

  return (
    <div className="mode-selection-screen">
      <GameHeader userStats={userStats} onBack={onBack} />
      
      <ModeSelector
        gameModes={gameModes}
        selectedMode={selectedMode}
        onModeSelect={onModeSelect}
      />

      <div className="start-game-section">
        <button
          className="btn btn-primary btn-large"
          onClick={onStartGame}
          disabled={!isStartButtonEnabled}
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;
