import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>
            🍪 Cookie Consent
          </div>
          <div className={styles.description}>
            Chúng tôi sử dụng cookie để cải thiện trải nghiệm học tập và phân tích lưu lượng truy cập. 
            Bằng cách tiếp tục sử dụng trang web này, bạn đồng ý với việc sử dụng cookie của chúng tôi.
          </div>
        </div>
        
        <div className={styles.buttons}>
          <button
            onClick={handleDecline}
            className={styles.declineButton}
          >
            Từ chối
          </button>
          
          <button
            onClick={handleAccept}
            className={styles.acceptButton}
          >
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 