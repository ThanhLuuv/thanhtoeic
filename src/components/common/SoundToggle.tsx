import React from 'react';
import styles from './SoundToggle.module.css';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ soundEnabled, onToggle }) => {
  return (
    <div className={styles.container}>
      <button
        onClick={onToggle}
        className={`${styles.toggleButton} ${soundEnabled ? styles.enabled : styles.disabled}`}
        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        {soundEnabled ? '●' : '○'}
      </button>
      <span className={styles.label}>
        Sound
      </span>
    </div>
  );
}; 