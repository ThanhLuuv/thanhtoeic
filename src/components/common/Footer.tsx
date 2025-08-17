// File: components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>© 2025 by thanhlaptrinh</p>
            <p className={styles.email}>lvthanh.work@gmail.com</p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className={styles.scrollToTopButton}
          >
            <svg className={styles.scrollToTopIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;