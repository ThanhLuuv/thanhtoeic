import React from 'react';
import './QuestionCounter.css';

interface QuestionCounterProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionCounter: React.FC<QuestionCounterProps> = ({ 
  currentQuestion, 
  totalQuestions 
}) => {
  return (
    <div className="question-number">
      Câu {currentQuestion}/{totalQuestions}
    </div>
  );
};

export default QuestionCounter;
