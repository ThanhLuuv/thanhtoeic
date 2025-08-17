import React from 'react';
import styles from './FooterSection.module.css';

interface FooterSectionProps {
  showAnswer: boolean;
  isChecked: boolean;
  isCorrect: boolean;
}

const FooterSection: React.FC<FooterSectionProps> = ({
  showAnswer,
  isChecked,
  isCorrect
}) => {
  return (
    <div className={styles.footerSection}>
      {/* Keyboard Shortcuts */}
      <div className={styles.shortcutsSection}>
        <div className={styles.shortcutsRow}>
          <div className={styles.shortcutItem}>
            <kbd className={styles.shortcutKey}>Enter</kbd>
            <span className={styles.shortcutDescription}>
              {isChecked ? 'Go to next word' : 'Check answer'}
            </span>
          </div>
          
          <div className={styles.shortcutItem}>
            <kbd className={styles.shortcutKey}>Shift</kbd>
            <span className={styles.shortcutDescription}>Play audio</span>
          </div>
          
          <div className={styles.shortcutItem}>
            <kbd className={styles.shortcutKey}>Ctrl</kbd>
            <span className={styles.shortcutDescription}>Toggle answer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
