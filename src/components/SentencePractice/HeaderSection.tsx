import React from 'react';
import styles from './HeaderSection.module.css';

interface HeaderSectionProps {
  part: string;
  currentIndex: number;
  sentenceListLength: number;
  progress: number;
  setIdx: number;
  totalSets: number;
  completedSentences: number;
  onBack: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  part,
  currentIndex,
  sentenceListLength,
  progress,
  setIdx,
  totalSets,
  completedSentences,
  onBack
}) => {
  return (
    <div className={styles.headerSection}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className={styles.backButton}
        title="Back to home"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7"/>
        </svg>
        <span>Back</span>
      </button>

      {/* Part and Set Info */}
      <div className={styles.topicInfo}>
        <h2 className={styles.topicTitle}>{part.toUpperCase()}</h2>
        <div className={styles.setInfo}>
          <span className={styles.setNumber}>Set {setIdx + 1}</span>
          {totalSets > 1 && (
            <span className={styles.totalSets}>/ {totalSets}</span>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.wordCounter}>
            {currentIndex + 1} / {sentenceListLength}
          </span>
          <span className={styles.completedCount}>
            {completedSentences}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className={styles.progressPercentage}>
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
