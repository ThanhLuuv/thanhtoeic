import React from 'react';
import './StreakCard.css';

interface StreakCardProps {
  streak: number;
}

const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  return (
    <div className="streak-card">
      <div className="streak-number">🔥 {streak}</div>
      <div className="streak-label">Trả lời đúng liên tiếp</div>
    </div>
  );
};

export default StreakCard;
