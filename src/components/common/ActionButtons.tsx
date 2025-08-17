import React from 'react';
import { 
  ArrowBack, 
  CheckCircle, 
  ArrowForward, 
  FastForward 
} from '@mui/icons-material';
import styles from './ActionButtons.module.css';

interface ActionButton {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  show?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  gap?: number;
  marginBottom?: number;
}

export const 
ActionButtons: React.FC<ActionButtonsProps> = ({ 
  buttons, 
  gap = 14, 
  marginBottom = 10 
}) => {
  const getButtonClasses = (variant: string, text: string) => {
    const isCircular = text === 'ArrowBack' || text === 'FastForward';
    const isRounded = text === 'Check' || text === 'Next';
    
    let sizeClass = styles.default;
    if (isCircular) {
      sizeClass = styles.circular;
    } else if (isRounded) {
      sizeClass = styles.rounded;
    }
    
    return `${styles.button} ${sizeClass} ${styles[variant]}`;
  };

  const shouldShowBothIconAndText = (text: string) => {
    return text === 'Check' || text === 'Next';
  };

  const visibleButtons = buttons.filter(button => button.show !== false);

  return (
    <div className={styles.container} style={{ gap, marginBottom }}>
      {visibleButtons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={getButtonClasses(button.variant, button.text)}
          title={button.text}
        >
          {shouldShowBothIconAndText(button.text) && button.icon ? (
            <>
              {button.icon}
              <span style={{ marginLeft: '8px' }}>{button.text}</span>
            </>
          ) : (
            button.icon || button.text
          )}
        </button>
      ))}
    </div>
  );
}; 