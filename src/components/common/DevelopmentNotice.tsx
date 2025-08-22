import React from 'react';
import styles from './DevelopmentNotice.module.css';

type DevelopmentNoticeProps = {
  storageKey?: string;
};

const DEFAULT_STORAGE_KEY = 'dev_notice_dismissed_v1';

const DevelopmentNotice: React.FC<DevelopmentNoticeProps> = ({ storageKey = DEFAULT_STORAGE_KEY }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    try {
      localStorage.setItem(storageKey, '1');
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9.27L4.5 7.5v9l7.5 3.75 7.5-3.75v-9L12 11.27z" fill="currentColor"/>
          </svg>
          <h3 className={styles.title}>Thông báo phát triển</h3>
        </div>
        <div className={styles.content}>
          <div className={styles.badge}>Beta • Đang phát triển</div>
          <p style={{ marginTop: 10 }}>
            Dự án hiện đang trong quá trình phát triển. Cảm ơn bạn đã ghé thăm và hãy cùng đón chờ bản hoàn thiện nhé!
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={handleClose}>Đã hiểu</button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentNotice;


