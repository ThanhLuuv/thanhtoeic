import React from 'react';
import './App.css';
import DictationList from './pages/DictationList';
import { Routes, Route } from 'react-router-dom';
import DictationPractice from './components/DictationPractice';
  // import Part1DictationPractice from './components/Part1DictationPractice';
  // import Part2DictationPractice from './components/Part2DictationPractice';
import FloatingFeedback from './components/FloatingFeedback';
import CookieConsent from './components/common/CookieConsent';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import GrammarGamePage from './pages/GrammarGamePage';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    loadGoogleAnalytics?: () => void;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const App: React.FC = () => {
  const handleCookieAccept = () => {
    // Load Google Analytics when user accepts cookies
    if (window.loadGoogleAnalytics) {
      window.loadGoogleAnalytics();
    }
  };

  const handleCookieDecline = () => {
    // Handle when user declines cookies
    console.log('User declined cookies');
    // Optionally track decline event
    if (window.gtag) {
      window.gtag('event', 'cookie_consent_declined');
    }
  };

  return (
    <>
      <Routes>
        {/* Authentication routes - no header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dictation practice route - no header/footer */}
        <Route
          path="/dictation/:setIndex"
          element={<DictationPractice />}
        />

        {/* Grammar game route - no header/footer */}
        <Route path="/grammar-game" element={<GrammarGamePage />} />
        
        {/* Other routes with header/footer */}
        <Route
          path="*"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Routes>
                <Route path="/" element={<DictationList />} />
                <Route path="/vocabulary/:setIndex" element={<DictationPractice />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/not-found" element={<NotFound />} />
              </Routes>
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
      </Routes>
      <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
    </>
  );
};

export default App;