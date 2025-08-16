import React from 'react';
import GameHeader from './GameHeader';
import QuestionPanel from './QuestionPanel';
import SidePanel from './SidePanel';
import { UserStats, Question } from './types';
import './GameplayScreen.css';

interface GameplayScreenProps {
  userStats: UserStats;
  currentMode: string;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  score: number;
  streak: number;
  selectedAnswer: number | null;
  currentQuestionData: Question;
  questionText: string;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onBackToModeSelection: () => void;
  onBack?: () => void;
  loading?: boolean;
}

const GameplayScreen: React.FC<GameplayScreenProps> = ({
  userStats,
  currentMode,
  currentQuestion,
  totalQuestions,
  timeLeft,
  score,
  streak,
  selectedAnswer,
  currentQuestionData,
  questionText,
  onOptionSelect,
  onSubmit,
  onBackToModeSelection,
  onBack,
  loading = false
}) => {
  const getModeDisplayName = (mode: string): string => {
    switch(mode) {
      case 'classify':
        return 'Đoán Kiểu Câu';
      case 'choice':
        return 'Chọn Đáp Án';
      case 'structure':
        return 'Cấu Trúc Câu';
      default:
        return '';
    }
  };

  return (
    <div className="gameplay-screen">
      <GameHeader userStats={userStats} onBack={onBack} />

      <div className="current-mode-display">
        <div className="mode-indicator">
          {getModeDisplayName(currentMode)}
        </div>
      </div>

      <div className="game-board">
        <QuestionPanel
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          timeLeft={timeLeft}
          questionText={questionText}
          sentence={currentQuestionData.sentence}
          options={currentQuestionData.options}
          selectedAnswer={selectedAnswer}
          onOptionSelect={onOptionSelect}
          onSubmit={onSubmit}
          loading={loading}
        />

        <SidePanel
          score={score}
          streak={streak}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          hint={currentQuestionData.hint}
        />
      </div>
    </div>
  );
};

export default GameplayScreen;
