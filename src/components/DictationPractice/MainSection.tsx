import React, { useRef, useEffect } from 'react';
import { VocabularyItem } from '../../services';
import { ActionButtons } from '../common';
import { VolumeUp, MusicNote, Lightbulb } from '@mui/icons-material';
import styles from './MainSection.module.css';

interface MainSectionProps {
  item: VocabularyItem;
  currentIndex: number;
  vocabListLength: number;
  userInputs: string[];
  result: (boolean | null)[];
  showAnswer: boolean;
  showNextButton: boolean;
  isChecked: boolean;
  isCorrect: boolean;
  soundEnabled: boolean;
  actionButtons: Array<{
    text: string;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'success' | 'warning';
    disabled: boolean;
    show: boolean;
  }>;
  onInputChange: (value: string) => void;
  onPlayAudio: (audio: string, word: string) => void;
  onToggleAnswer: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSoundToggle: () => void;
}

const MainSection: React.FC<MainSectionProps> = ({
  item,
  currentIndex,
  vocabListLength,
  userInputs,
  result,
  showAnswer,
  showNextButton,
  isChecked,
  isCorrect,
  soundEnabled,
  actionButtons,
  onInputChange,
  onPlayAudio,
  onToggleAnswer,
  onKeyDown,
  onSoundToggle
}) => {
  const currentResult = result[currentIndex];
  const isCurrentCorrect = currentResult === true;
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input in all scenarios: on mount, after check (correct/wrong), and when becoming editable
  useEffect(() => {
    if (inputRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select all text only when it becomes editable after wrong answer
          if (isChecked && !isCurrentCorrect) {
            inputRef.current.select();
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isChecked, isCurrentCorrect]);

  // Focus input when component mounts or when currentIndex changes
  useEffect(() => {
    if (inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className={styles.mainSection}>
      {/* Sound Toggle - Top Right Corner */}
      <div className={styles.soundToggleContainer}>
        <button
          onClick={onSoundToggle}
          className={`${styles.soundToggleButton} ${soundEnabled ? styles.soundOn : styles.soundOff}`}
          title="Toggle Sound"
        >
          <div className={styles.soundIconWrapper}>
            <MusicNote className={`${styles.soundIcon} ${soundEnabled ? styles.soundIconOn : styles.soundIconOff}`} />
            {!soundEnabled && <div className={styles.soundStrikethrough}></div>}
          </div>
        </button>
      </div>

      {/* Word Display */}
      <div className={styles.wordDisplay}>
        <div className={styles.wordInfo}>
          <h3 className={styles.wordNumber}>
            Word {currentIndex + 1} of {vocabListLength}
          </h3>
        </div>
      </div>

      {/* Audio and Input Section */}
      <div className={styles.audioInputSection}>
        {/* Input Field with Audio Icon and Lightbulb */}
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <button
              onClick={() => onPlayAudio(item.audio || '', item.word)}
              className={styles.audioIconButton}
              title="Click to play audio (Shift + Click)"
            >
              <VolumeUp className={styles.audioIcon} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={userInputs[currentIndex] || ''}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type the word you hear..."
              className={`${styles.wordInput} ${
                isChecked 
                  ? isCurrentCorrect 
                    ? styles.inputCorrect 
                    : styles.inputIncorrect
                  : ''
              }`}
              disabled={false}
              autoFocus
            />
            {!showAnswer && (
              <button
                onClick={onToggleAnswer}
                className={styles.lightbulbButton}
                title="Show answer (Ctrl + Click)"
              >
                <Lightbulb className={styles.lightbulbIcon} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtonsSection}>
        <div className={styles.customActionButtons}>
          <ActionButtons
            buttons={actionButtons}
          />
        </div>
      </div>

      {/* Answer Display */}
      {showAnswer && (
        <div className={styles.answerDisplay}>
          <div className={styles.answerCard}>
            <div className={styles.answerContent}>
              <div className={styles.answerInline}>
                <span className={styles.answerWord}>{item.word}</span>
                {item.phonetic && (
                  <span className={styles.answerPhonetic}>[{item.phonetic}]</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;
