// File: components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">AntToeic</h3>
              <p className="text-gray-300 text-sm mb-4">
                Personal TOEIC learning platform, providing free and high-quality 
                learning solutions for the community.
              </p>
              <div className="text-gray-300 text-sm">
                <p>Email: lvthanh.work@gmail.com</p>
                <p>Phone: 0876 06 6907</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/grammar-game" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Grammar Game
                  </Link>
                </li>
                <li>
                  <Link to="/toeic-guide" className="text-gray-300 hover:text-white text-sm transition-colors">
                    TOEIC Guide
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Pages */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/community" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/dmca" className="text-gray-300 hover:text-white text-sm transition-colors">
                    DMCA
                  </Link>
                </li>
                <li>
                  <a 
                    href="/ads.txt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    ads.txt
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-300 text-sm mb-4 md:mb-0">
                <p>© 2025 Lưu Van Thanh. All rights reserved.</p>
                <p>Address: P Thu Duc, HCMC</p>
              </div>
              
              <button 
                onClick={scrollToTop}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                aria-label="Scroll to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;