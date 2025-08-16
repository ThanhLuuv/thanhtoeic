import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Question } from '../types';
import { questions } from '../data/questions';

const TOTAL_QUESTIONS = 20;
const INITIAL_TIME = 15;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentMode: 'classify',
    timeLeft: INITIAL_TIME,
    currentQuestion: 1,
    totalQuestions: TOTAL_QUESTIONS,
    score: 0,
    streak: 0,
    selectedAnswer: null,
    currentQuestionIndex: 0,
    isGameActive: false,
    isGameEnded: false
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentQuestion = useCallback((): Question => {
    const modeQuestions = questions[gameState.currentMode];
    return modeQuestions[gameState.currentQuestionIndex % modeQuestions.length];
  }, [gameState.currentMode, gameState.currentQuestionIndex]);

  const getQuestionText = useCallback((mode: string): string => {
    switch(mode) {
      case 'classify':
        return 'Câu này thuộc loại thì nào?';
      case 'choice':
        return 'Chọn đáp án đúng để hoàn thành câu:';
      case 'structure':
        return 'Câu này thiếu thành phần gì?';
      default:
        return '';
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    setGameState(prev => ({ ...prev, timeLeft: INITIAL_TIME }));

    timerIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        if (newTimeLeft <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
          return { ...prev, timeLeft: 0 };
        }
        
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    // Tick sound simulation for last 10 seconds
    tickIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 10 && prev.timeLeft > 0) {
          // Play tick sound logic here
          return prev;
        }
        return prev;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const selectGameMode = useCallback((mode: string) => {
    setGameState(prev => ({
      ...prev,
      currentMode: mode,
      currentQuestionIndex: 0,
      currentQuestion: 1,
      score: 0,
      streak: 0,
      selectedAnswer: null,
      isGameActive: false,
      isGameEnded: false
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameActive: true,
      currentQuestionIndex: 0,
      currentQuestion: 1,
      score: 0,
      streak: 0,
      selectedAnswer: null
    }));
    startTimer();
  }, [startTimer]);

  const backToModeSelection = useCallback(() => {
    stopTimer();
    setGameState(prev => ({
      ...prev,
      isGameActive: false,
      currentQuestionIndex: 0,
      currentQuestion: 1,
      score: 0,
      streak: 0,
      selectedAnswer: null,
      timeLeft: INITIAL_TIME
    }));
  }, [stopTimer]);

  const selectAnswer = useCallback((answerIndex: number) => {
    setGameState(prev => ({ ...prev, selectedAnswer: answerIndex }));
  }, []);

  const submitAnswer = useCallback(() => {
    if (gameState.selectedAnswer === null) return null;

    stopTimer();
    
    const currentQuestion = getCurrentQuestion();
    const isCorrect = gameState.selectedAnswer === currentQuestion.correct;

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      selectedAnswer: null
    }));

    // Return result for feedback
    return {
      isCorrect,
      correctAnswer: currentQuestion.options[currentQuestion.correct]
    };
  }, [gameState.selectedAnswer, stopTimer, getCurrentQuestion]);

  const nextQuestion = useCallback(() => {
    setGameState(prev => {
      const newQuestionIndex = prev.currentQuestionIndex + 1;
      const newQuestionNumber = prev.currentQuestion + 1;

      if (newQuestionNumber > TOTAL_QUESTIONS) {
        return { ...prev, isGameEnded: true, isGameActive: false };
      }

      return {
        ...prev,
        currentQuestionIndex: newQuestionIndex,
        currentQuestion: newQuestionNumber,
        selectedAnswer: null,
        timeLeft: INITIAL_TIME
      };
    });

    startTimer();
  }, [startTimer]);

  const restartGame = useCallback(() => {
    setGameState({
      currentMode: 'classify',
      timeLeft: INITIAL_TIME,
      currentQuestion: 1,
      totalQuestions: TOTAL_QUESTIONS,
      score: 0,
      streak: 0,
      selectedAnswer: null,
      currentQuestionIndex: 0,
      isGameActive: false,
      isGameEnded: false
    });
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // Auto next when time is up
  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isGameActive) {
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  }, [gameState.timeLeft, gameState.isGameActive, nextQuestion]);

  return {
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
  };
};
