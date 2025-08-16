import React from 'react';
import './QuestionSentence.css';

interface QuestionSentenceProps {
  sentence: string;
}

const QuestionSentence: React.FC<QuestionSentenceProps> = ({ sentence }) => {
  return (
    <div className="question-sentence">
      {sentence}
    </div>
  );
};

export default QuestionSentence;
