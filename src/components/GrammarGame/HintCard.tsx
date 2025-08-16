import React from 'react';
import './HintCard.css';

interface HintCardProps {
  hint: string;
}

const HintCard: React.FC<HintCardProps> = ({ hint }) => {
  return (
    <div className="hint-card">
      <div className="hint-title">
        💡 Gợi ý
      </div>
      <div className="hint-content">
        {hint}
      </div>
    </div>
  );
};

export default HintCard;
