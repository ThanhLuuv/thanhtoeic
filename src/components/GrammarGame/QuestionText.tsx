import React from 'react';
import './QuestionText.css';

interface QuestionTextProps {
  text: string;
}

const QuestionText: React.FC<QuestionTextProps> = ({ text }) => {
  return (
    <div className="question-text">
      <strong>{text}</strong>
    </div>
  );
};

export default QuestionText;
