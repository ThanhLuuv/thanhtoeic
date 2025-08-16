import React from 'react';
import QuestionCounter from './QuestionCounter';
import Timer from './Timer';
import QuestionText from './QuestionText';
import QuestionSentence from './QuestionSentence';
import ChoiceOptions from './ChoiceOptions';
import ActionButtons from './ActionButtons';
import './QuestionPanel.css';

interface QuestionPanelProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  questionText: string;
  sentence: string;
  options: string[];
  selectedAnswer: number | null;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  currentQuestion,
  totalQuestions,
  timeLeft,
  questionText,
  sentence,
  options,
  selectedAnswer,
  onOptionSelect,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="question-panel">
      <div className="question-header">
        <QuestionCounter 
          currentQuestion={currentQuestion} 
          totalQuestions={totalQuestions} 
        />
        <Timer timeLeft={timeLeft} />
      </div>

      <QuestionText text={questionText} />
      <QuestionSentence sentence={sentence} />

      <ChoiceOptions
        options={options}
        selectedAnswer={selectedAnswer}
        onOptionSelect={onOptionSelect}
      />

      <ActionButtons 
        onSubmit={onSubmit}
        disabled={selectedAnswer === null}
        loading={loading}
      />
    </div>
  );
};

export default QuestionPanel;
