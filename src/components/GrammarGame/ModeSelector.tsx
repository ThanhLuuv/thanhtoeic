import React from 'react';
import { GameMode } from './types';
import './ModeSelector.css';

interface ModeSelectorProps {
  gameModes: GameMode[];
  selectedMode: string;
  onModeSelect: (modeId: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  gameModes, 
  selectedMode, 
  onModeSelect 
}) => {
  return (
    <div className="mode-selector">
      {gameModes.map((mode) => (
        <div
          key={mode.id}
          className={`mode-btn ${selectedMode === mode.id ? 'selected' : ''}`}
          onClick={() => onModeSelect(mode.id)}
        >
          <div className="mode-title">{mode.title}</div>
          <div className="mode-desc">{mode.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ModeSelector;
