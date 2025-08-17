import React from 'react';
import styles from './AudioButton.module.css';

interface AudioButtonProps {
  onClick: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

export const AudioButton: React.FC<AudioButtonProps> = ({ 
  onClick, 
  title = "Play audio",
  size = 'medium'
}) => {

  return (
    <button 
      onClick={onClick} 
      className={`${styles.audioButton} ${styles[size]}`}
      title={title}
    >
      🔊
    </button>
  );
}; 