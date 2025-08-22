import React, { useRef, useEffect, useState } from 'react';
import { Sentence } from '../../services';
import { ActionButtons } from '../common';
import { VolumeUp, MusicNote, Lightbulb } from '@mui/icons-material';
import styles from './MainSection.module.css';
import { useNavigate } from 'react-router-dom';

interface MainSectionProps {
  item: Sentence;
  currentIndex: number;
  sentenceListLength: number;
  userInputs: string[][];
  result: (boolean | null)[];
  wordResults: boolean[][]; // Add word-level results
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
  onInputChange: (value: string, wordIndex: number) => void;
  onPlayAudio: (audio: string, sentence: string) => void;
  onToggleAnswer: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSoundToggle: () => void;
}

const MainSection: React.FC<MainSectionProps> = ({
  item,
  currentIndex,
  sentenceListLength,
  userInputs,
  result,
  wordResults,
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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize refs array when sentence changes
  useEffect(() => {
    const sentenceWords = item.englishSentence.split(' ');
    inputRefs.current = inputRefs.current.slice(0, sentenceWords.length);
  }, [item.englishSentence]);

  // Focus first input only when component mounts or when currentIndex changes
  useEffect(() => {
    if (inputRefs.current[0]) {
      const timer = setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Function to get input width based on word length
  const getInputWidth = (word: string) => {
    const wordLength = word.length;
    
    if (wordLength <= 3) return '50px';      // Very short words (a, an, the, in, on)
    if (wordLength <= 5) return '70px';      // Short words (this, that, with)
    if (wordLength <= 8) return '90px';      // Medium words (because, although)
    if (wordLength <= 12) return '110px';    // Long words (nevertheless, consequently)
    return '130px';                          // Very long words
  };

  // Function to get input font size based on word length
  const getInputFontSize = (word: string) => {
    const wordLength = word.length;
    
    if (wordLength <= 3) return '0.85rem';   // Smaller font for short words
    if (wordLength <= 8) return '0.9rem';    // Normal font for medium words
    return '0.8rem';                         // Smaller font for long words to fit
  };

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

      {/* Sentence Display */}
      <div className={styles.wordDisplay}>
        <div className={styles.wordInfo}>
          <h3 className={styles.wordNumber}>
            Sentence {currentIndex + 1} of {sentenceListLength}
          </h3>
        </div>
      </div>

      {/* Audio and Input Section */}
      <div className={styles.audioInputSection}>
        {/* Input Field with Audio Icon and Lightbulb */}
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <button
              onClick={() => onPlayAudio(item.audio || '', item.englishSentence)}
              className={styles.audioIconButton}
              title="Click to play audio (Shift + Click)"
            >
              <VolumeUp className={styles.audioIcon} />
            </button>
            
            {/* Multiple input fields for each word */}
            <div className={styles.wordInputsContainer}>
              {item.englishSentence.split(' ').map((word, wordIndex) => {
                const currentWordResults = wordResults[currentIndex] || [];
                const isWordCorrect = currentWordResults[wordIndex];
                const isWordChecked = isChecked;
                
                let inputClassName = styles.wordInput;
                if (isWordChecked) {
                  if (isWordCorrect) {
                    inputClassName += ` ${styles.inputCorrect}`;
                  } else {
                    inputClassName += ` ${styles.inputIncorrect}`;
                  }
                }
                
                // Dynamic styling based on word length
                const dynamicStyles = {
                  minWidth: getInputWidth(word),
                  maxWidth: getInputWidth(word),
                  fontSize: getInputFontSize(word)
                };
                
                return (
                  <input
                    key={wordIndex}
                    ref={(el) => {
                      inputRefs.current[wordIndex] = el;
                    }}
                    type="text"
                    value={userInputs[currentIndex]?.[wordIndex] || ''}
                    onChange={(e) => onInputChange(e.target.value, wordIndex)}
                    onKeyDown={onKeyDown}
                    placeholder={`Word ${wordIndex + 1}`}
                    className={inputClassName}
                    style={dynamicStyles}
                    disabled={false}
                    autoFocus={wordIndex === 0}
                  />
                );
              })}
            </div>
            
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
              <div className={styles.answerEnglish}>
                <span className={styles.answerWord}>{item.englishSentence}</span>
              </div>
              <div className={styles.answerVietnamese}>
                <span className={styles.answerPhonetic}>{item.vietnameseTranslation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;
