import React from 'react';
import styles from './AnswerDisplay.module.css';

interface AnswerItem {
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
}

interface AnswerDisplayProps {
  showAnswer: boolean;
  onToggleAnswer: () => void;
  answers: AnswerItem[];
  title?: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({
  showAnswer,
  onToggleAnswer,
  answers,
  title = "Missing words:"
}) => {
  if (!showAnswer) {
    return (
      <div className={styles.container}>
        <button
          onClick={onToggleAnswer}
          className={styles.toggleButton}
        >
          Show Answer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.answerCard}>
        <div className={styles.answerContent}>
          <div className={styles.answerTitle}>
            {title}
          </div>
          {answers.map((answer, index) => (
            <div key={index} className={styles.answerItem}>
              <div className={styles.word}>
                {answer.word} ({answer.type})
              </div>
              <div className={styles.phonetic}>
                {answer.phonetic}
              </div>
              <div className={styles.meaning}>
                {answer.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 