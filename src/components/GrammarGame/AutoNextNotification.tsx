import React from 'react';
import './AutoNextNotification.css';

interface AutoNextNotificationProps {
  show: boolean;
  type: 'timeout' | 'correct' | 'incorrect';
  message?: string;
  correctAnswer?: string;
}

const AutoNextNotification: React.FC<AutoNextNotificationProps> = ({ 
  show, 
  type, 
  message, 
  correctAnswer 
}) => {
  const getNotificationContent = () => {
    switch (type) {
      case 'timeout':
        return 'Hết giờ! Chuyển câu tiếp theo...';
      case 'correct':
        return message || 'Chính xác! +10 điểm';
      case 'incorrect':
        return message || `Sai rồi! Đáp án đúng: ${correctAnswer}`;
      default:
        return '';
    }
  };

  const getNotificationClass = () => {
    switch (type) {
      case 'timeout':
        return 'auto-next timeout';
      case 'correct':
        return 'auto-next correct';
      case 'incorrect':
        return 'auto-next incorrect';
      default:
        return 'auto-next';
    }
  };

  return (
    <div className={`${getNotificationClass()} ${show ? 'show' : ''}`}>
      {getNotificationContent()}
    </div>
  );
};

export default AutoNextNotification;
