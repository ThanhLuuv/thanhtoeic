import React from 'react';
import './ChoiceOptions.css';

interface ChoiceOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onOptionSelect: (index: number) => void;
}

const ChoiceOptions: React.FC<ChoiceOptionsProps> = ({ 
  options, 
  selectedAnswer, 
  onOptionSelect 
}) => {
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={index}
          className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
          onClick={() => onOptionSelect(index)}
        >
          <span className="option-letter">
            {String.fromCharCode(65 + index)}
          </span>
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChoiceOptions;
