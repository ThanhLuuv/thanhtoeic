import React, { useRef } from 'react';
import styles from './MainPracticeCard.module.css';
import { VocabularyItem } from '../../services';
import { SoundToggle, ProgressBar, AudioButton, ActionButtons, AnswerDisplay} from '../common';
import KeyboardShortcuts from './KeyboardShortcuts';

interface MainPracticeCardProps {
  item: VocabularyItem;
  currentIndex: number;
  vocabListLength: number;
  progress: number;
  soundEnabled: boolean;
  userInputs: string[];
  result: (boolean | null)[];
  showAnswer: boolean;
  showNextButton: boolean;
  isChecked: boolean;
  isCorrect: boolean;
  topic: string;
  setIdx: number;
  completedSentences: number;
  actionButtons: any[];
  answerItems: any[];
  onSoundToggle: () => void;
  onInputChange: (value: string) => void;
  onPlayAudio: (audio?: string, word?: string) => void;
  onToggleAnswer: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const MainPracticeCard: React.FC<MainPracticeCardProps> = ({
  item,
  currentIndex,
  vocabListLength,
  progress,
  soundEnabled,
  userInputs,
  result,
  showAnswer,
  showNextButton,
  isChecked,
  isCorrect,
  topic,
  setIdx,
  completedSentences,
  actionButtons,
  answerItems,
  onSoundToggle,
  onInputChange,
  onPlayAudio,
  onToggleAnswer,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.card}>
      <SoundToggle 
        soundEnabled={soundEnabled}
        onToggle={onSoundToggle}
      />

      <ProgressBar progress={progress} />

      <div className={styles.topicSection}>
        Topic: <b>{topic}</b>
        <span className={styles.completedBadge}>
          ✓ {completedSentences} completed
        </span>
      </div>

      <div className={styles.wordCounter}>
        <span className={styles.wordCounterBadge}>
          Word {currentIndex + 1} / {vocabListLength}
        </span>
      </div>

      {/* Main Input Section */}
      <div className={styles.inputSection}>
        <AudioButton 
          onClick={() => onPlayAudio(item.audio, item.word)}
          title="Play word"
        />

        <input
          ref={inputRef}
          type="text"
          value={userInputs[currentIndex] || ''}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          readOnly={isCorrect}
          className={`${styles.input} ${
            isChecked 
              ? (isCorrect ? styles.correct : styles.incorrect)
              : styles.default
          }`}
          autoComplete="off"
          placeholder="Type the word..."
        />
        
        {isChecked && (
          isCorrect ? 
            <span className={`${styles.resultIcon} ${styles.correct}`}>✔️</span> : 
            <span className={`${styles.resultIcon} ${styles.incorrect}`}>❌</span>
        )}
      </div>
      
      <ActionButtons buttons={actionButtons} />

      {/* Keyboard Shortcuts inside card */}
      <KeyboardShortcuts />

      <AnswerDisplay
        showAnswer={showAnswer}
        onToggleAnswer={onToggleAnswer}
        answers={answerItems}
        title="Word:"
      />
    </div>
  );
};

export default MainPracticeCard;
