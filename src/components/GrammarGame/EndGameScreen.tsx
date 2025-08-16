import React from 'react';
import './EndGameScreen.css';

interface EndGameScreenProps {
  score: number;
  onRestart: () => void;
}

const EndGameScreen: React.FC<EndGameScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="end-game">
      <h1>Hoàn thành game!</h1>
      <div className="end-game-content">
        <h2>Kết quả của bạn:</h2>
        <div className="final-score">{score} điểm</div>
        <button className="btn btn-primary" onClick={onRestart}>
          Chơi lại
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;
