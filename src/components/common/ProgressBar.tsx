import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
  marginBottom?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#f0f0f0',
  progressColor = '#4caf50',
  borderRadius = 8,
  marginBottom = 18
}) => {
  const getHeightClass = () => {
    if (height <= 4) return styles.thin;
    if (height <= 8) return styles.default;
    if (height <= 12) return styles.medium;
    if (height <= 16) return styles.thick;
    return styles.custom;
  };

  const getProgressColorClass = () => {
    if (progressColor === '#4caf50') return styles.success;
    if (progressColor === '#ff9800') return styles.warning;
    if (progressColor === '#f44336') return styles.danger;
    if (progressColor === '#6b7280') return styles.secondary;
    return styles.primary;
  };

  return (
    <div 
      className={`${styles.progressBarContainer} ${getHeightClass()}`}
      style={{ 
        height: height > 16 ? height : undefined,
        background: backgroundColor !== '#f0f0f0' ? backgroundColor : undefined,
        borderRadius,
        marginBottom
      }}
    >
      <div 
        className={`${styles.progressBarFill} ${getProgressColorClass()}`}
        style={{ 
          width: `${progress}%`,
          background: progressColor !== '#4caf50' && progressColor !== '#ff9800' && 
          progressColor !== '#f44336' && progressColor !== '#6b7280' ? progressColor : undefined
        }}
      />
    </div>
  );
}; 