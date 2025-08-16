import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModeSelectionScreen from './ModeSelectionScreen';
import GameplayScreen from './GameplayScreen';
import EndGameScreen from './EndGameScreen';
import AutoNextNotification from './AutoNextNotification';
import { useGameLogic } from './hooks/useGameLogic';
import { gameModes } from './data/gameModes';
import './GrammarGame.css';

const GrammarGame: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    getCurrentQuestion,
    getQuestionText,
    selectGameMode,
    startGame,
    backToModeSelection,
    selectAnswer,
    submitAnswer,
    restartGame,
    nextQuestion
  } = useGameLogic();

  const [showAutoNext, setShowAutoNext] = useState(false);
  const [notificationType, setNotificationType] = useState<'timeout' | 'correct' | 'incorrect'>('timeout');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user stats - in real app this would come from user context/API
  const userStats = {
    score: gameState.score,
    level: 'Level 8',
    streak: gameState.streak
  };

  // Handle auto next notification
  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isGameActive) {
      setNotificationType('timeout');
      setShowAutoNext(true);
      setTimeout(() => {
        setShowAutoNext(false);
        // Auto next question after timeout notification
        nextQuestion();
      }, 1500);
    }
  }, [gameState.timeLeft, gameState.isGameActive, nextQuestion]);

  // Handle submit answer with loading state
  const handleSubmitAnswer = async () => {
    if (gameState.selectedAnswer === null) return;
    
    setLoading(true);
    const result = submitAnswer();
    
    // Show feedback notification
    if (result && result.isCorrect !== undefined) {
      if (result.isCorrect) {
        setNotificationType('correct');
        setNotificationMessage('Chính xác! +10 điểm');
      } else {
        setNotificationType('incorrect');
        setCorrectAnswer(result.correctAnswer || '');
        setNotificationMessage(`Sai rồi! Đáp án đúng: ${result.correctAnswer || ''}`);
      }
      
      setShowAutoNext(true);
      setTimeout(() => {
        setShowAutoNext(false);
      }, 2000);
    }
    
    // Auto next question after showing feedback
    setTimeout(() => {
      setLoading(false);
      nextQuestion();
    }, 2000);
  };

  // Handle restart game
  const handleRestart = () => {
    restartGame();
    setLoading(false);
    setShowAutoNext(false);
  };

  // Handle go back to main page
  const handleGoBack = () => {
    navigate('/');
  };

  // Render appropriate screen based on game state
  if (gameState.isGameEnded) {
    return (
      <div className="grammar-game-container">
        <EndGameScreen 
          score={gameState.score} 
          onRestart={handleRestart} 
        />
      </div>
    );
  }

  if (gameState.isGameActive) {
    const currentQuestionData = getCurrentQuestion();
    const questionText = getQuestionText(gameState.currentMode);

    return (
      <div className="grammar-game-container">
        <GameplayScreen
          userStats={userStats}
          currentMode={gameState.currentMode}
          currentQuestion={gameState.currentQuestion}
          totalQuestions={gameState.totalQuestions}
          timeLeft={gameState.timeLeft}
          score={gameState.score}
          streak={gameState.streak}
          selectedAnswer={gameState.selectedAnswer}
          currentQuestionData={currentQuestionData}
          questionText={questionText}
          onOptionSelect={selectAnswer}
          onSubmit={handleSubmitAnswer}
          onBackToModeSelection={backToModeSelection}
          onBack={handleGoBack}
          loading={loading}
        />
        <AutoNextNotification 
          show={showAutoNext} 
          type={notificationType}
          message={notificationMessage}
          correctAnswer={correctAnswer}
        />
      </div>
    );
  }

  return (
    <div className="grammar-game-container">
      <ModeSelectionScreen
        gameModes={gameModes}
        selectedMode={gameState.currentMode}
        userStats={userStats}
        onModeSelect={selectGameMode}
        onStartGame={startGame}
        onBack={handleGoBack}
      />
    </div>
  );
};

export default GrammarGame;
