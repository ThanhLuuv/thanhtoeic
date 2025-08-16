export interface Question {
  sentence: string;
  options: string[];
  correct: number;
  hint: string;
}

export interface GameMode {
  id: string;
  title: string;
  description: string;
}

export interface GameState {
  currentMode: string;
  timeLeft: number;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  streak: number;
  selectedAnswer: number | null;
  currentQuestionIndex: number;
  isGameActive: boolean;
  isGameEnded: boolean;
}

export interface UserStats {
  score: number;
  level: string;
  streak: number;
}
