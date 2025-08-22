import React from 'react';
import styles from './SuccessModal.module.css';
import { Sentence } from '../../services';

interface SuccessModalProps {
  showModal: boolean;
  isCorrect: boolean;
  showNextButton: boolean;
  item: Sentence;
  currentIndex: number;
  sentenceListLength: number;
  setIdx: number;
  totalSets: number;
  onNext: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  showModal,
  isCorrect,
  showNextButton,
  item,
  currentIndex,
  sentenceListLength,
  setIdx,
  totalSets,
  onNext,
}) => {

  if (!showModal || !isCorrect || !showNextButton) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.wordCard}>
          <div className={styles.meaning}>
            {item.vietnameseTranslation}
          </div>
          <div className={styles.wordRow}>
            <span className={styles.word}>{item.englishSentence}</span>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className={styles.nextButton}
        >
          {currentIndex === sentenceListLength - 1 
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
