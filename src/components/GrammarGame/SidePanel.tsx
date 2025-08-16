import React from 'react';
import ScoreCard from './ScoreCard';
import StreakCard from './StreakCard';
import HintCard from './HintCard';
import './SidePanel.css';

interface SidePanelProps {
  score: number;
  streak: number;
  currentQuestion: number;
  totalQuestions: number;
  hint: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ 
  score, 
  streak, 
  currentQuestion, 
  totalQuestions, 
  hint 
}) => {
  return (
    <div className="side-panel">
      <ScoreCard 
        score={score} 
        currentQuestion={currentQuestion} 
        totalQuestions={totalQuestions} 
      />
      <StreakCard streak={streak} />
      <HintCard hint={hint} />
    </div>
  );
};

export default SidePanel;
