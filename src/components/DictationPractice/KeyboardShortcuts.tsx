import React from 'react';
import styles from './KeyboardShortcuts.module.css';

const KeyboardShortcuts: React.FC = () => {
  return (
    <div className={styles.container}>
      <span className={styles.shortcutItem}>
        <kbd className={styles.keyboardKey}>Enter</kbd> Check/Next
      </span>
      <span className={styles.shortcutItem}>
        <kbd className={styles.keyboardKey}>Shift</kbd> Audio
      </span>
      <span className={styles.shortcutItem}>
        <kbd className={styles.keyboardKey}>Ctrl</kbd> Show Answer
      </span>
    </div>
  );
};

export default KeyboardShortcuts;
