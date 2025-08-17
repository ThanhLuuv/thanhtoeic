import React, { useState } from 'react';
import styles from './FloatingFeedback.module.css';

const FloatingFeedback: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  
    const formData = new FormData();
    formData.append("entry.1723349186", feedback); // 🔁 Thay entry.xxx bằng đúng mã bạn tìm được
  
    try {
      await fetch("https://docs.google.com/forms/d/e/1FAIpQLSdW34TmB7whrC-fyA4neEDaSn-GhNfbv8yEqwOC8i3Rjm1B2A/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors", // ⚠️ PHẢI CÓ để tránh CORS
      });
    } catch (err) {
      console.error("Lỗi gửi:", err);
    }
  
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setFeedback('');
    }, 2000);
  };
  
  

  return (
    <div className={styles.container}>
      {!open && (
        <button
        className={styles.feedbackButton}
        onClick={() => setOpen(true)}
        title="Send feedback"
      >
        <div className={styles.buttonContent}>
          <span role="img" aria-label="feedback" className={styles.emoji}>💬</span>
          <span className={styles.buttonText}>Feedback</span>
        </div>
      </button>
      )}
      {open && (
        <div className={styles.feedbackForm}>
          <div className={styles.formHeader}>
            <span className={styles.formTitle}>Feedback</span>
            <button
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              title="Close"
            >
              ×
            </button>
          </div>
          {submitted ? (
            <div className={styles.successMessage}>Thank you for your feedback!</div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="Enter feedback, suggestions or bug reports..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                required
              />
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!feedback.trim()}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingFeedback; 