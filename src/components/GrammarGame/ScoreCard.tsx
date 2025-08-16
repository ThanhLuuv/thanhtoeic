import React from 'react';
import './ScoreCard.css';

interface ScoreCardProps {
  score: number;
  currentQuestion: number;
  totalQuestions: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  currentQuestion, 
  totalQuestions 
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="score-card">
      <div className="score-title">Điểm hiện tại</div>
      <div className="score-value">{score.toLocaleString()}</div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
