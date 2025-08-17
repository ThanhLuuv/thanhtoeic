import React from 'react';
import styles from './SuccessModal.module.css';
import { VocabularyItem } from '../../services';

interface SuccessModalProps {
  showModal: boolean;
  isCorrect: boolean;
  showNextButton: boolean;
  item: VocabularyItem;
  currentIndex: number;
  vocabListLength: number;
  setIdx: number;
  totalSets: number;
  isGeneratingExample: boolean;
  exampleError: string | null;
  exampleSentence: any;
  currentExamples: any[];
  currentExampleIndex: number;
  onGenerateExample: () => void;
  onNext: () => void;
  onNextExample: () => void;
  onPrevExample: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  showModal,
  isCorrect,
  showNextButton,
  item,
  currentIndex,
  vocabListLength,
  setIdx,
  totalSets,
  isGeneratingExample,
  exampleError,
  exampleSentence,
  currentExamples,
  currentExampleIndex,
  onGenerateExample,
  onNext,
  onNextExample,
  onPrevExample,
}) => {

  if (!showModal || !isCorrect || !showNextButton) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.wordCard}>
          <div className={styles.meaning}>
            {item.meaning}
          </div>
          <div className={styles.wordRow}>
            <span className={styles.word}>{item.word}</span>
            <span className={styles.phonetic}>{item.phonetic}</span>
          </div>
        </div>

        {/* Example Generator Button */}
        <button
          onClick={onGenerateExample}
          disabled={isGeneratingExample}
          className={styles.exampleButton}
        >
          {isGeneratingExample ? (
            <>
              <div className={styles.spinner}></div>
              Creating
            </>
          ) : (
            <>
              {currentExamples.length > 0 ? 'Create new example' : 'Create example'}
            </>
          )}
        </button>

        {/* Example Error */}
        {exampleError && (
          <div className={styles.errorMessage}>
            {exampleError}
          </div>
        )}

        {/* Example Display */}
        {exampleSentence && (
          <div className={styles.exampleCard}>
            {/* Example counter */}
            {currentExamples.length > 1 && (
              <div className={styles.exampleCounter}>
                Example {currentExampleIndex + 1}/{currentExamples.length}
              </div>
            )}
            
            <div className={styles.englishSentence}>
              {exampleSentence.englishSentence}
            </div>
            <div className={styles.vietnameseTranslation}>
              {exampleSentence.vietnameseTranslation}
            </div>
            {exampleSentence.contextInfo && (
              <div className={styles.contextInfo}>
                💡 {exampleSentence.contextInfo}
              </div>
            )}
            
            {/* Navigation buttons for multiple examples */}
            {currentExamples.length > 1 && (
              <div className={styles.navigationButtons}>
                <button
                  onClick={onPrevExample}
                  disabled={currentExampleIndex === 0}
                  className={styles.navButton}
                >
                  ← Previous
                </button>
                <button
                  onClick={onNextExample}
                  disabled={currentExampleIndex === currentExamples.length - 1}
                  className={styles.navButton}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNext}
          className={styles.nextButton}
        >
          {currentIndex === vocabListLength - 1 
            ? (setIdx < totalSets - 1 ? 'Next Set →' : 'Finish →')
            : '→'
          }
        </button>
        {
          (
            <div className={styles.keyboardHint}>
              Press <kbd>Enter</kbd> to continue
            </div>
          )
        }
      </div>
    </div>
  );
};

export default SuccessModal;
