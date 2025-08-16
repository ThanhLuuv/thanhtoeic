import React from 'react';
import { UserStats } from './types';
import './GameHeader.css';

interface GameHeaderProps {
  userStats: UserStats;
  onBack?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ userStats, onBack }) => {
  return (
    <header className="game-header">
      <div className="header-content">
        <div className="header-left">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div className="logo">
            <div className="logo-icon">GM</div>
            <h1>Grammar Master</h1>
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{userStats.score}</span>
            <span className="stat-label">Điểm</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userStats.level}</span>
            <span className="stat-label">Cấp độ</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🔥 {userStats.streak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
