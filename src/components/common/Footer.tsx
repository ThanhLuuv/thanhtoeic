// File: components/Footer.tsx
import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Simple Footer with Copyright */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <p className="text-sm">© 2025 by thanhlaptrinh</p>
            <p className="text-sm text-gray-400 mt-1">lvthanh.work@gmail.com</p>
          </div>
          
          {/* <div className="flex items-center justify-center">
            <button 
              onClick={scrollToTop}
              className="bg-[#00CCFF] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#0099CC] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;