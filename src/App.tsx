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
import DevelopmentNotice from './components/common/DevelopmentNotice';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import GrammarGamePage from './pages/GrammarGamePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Refund from './pages/Refund';
import Community from './pages/Community';
import DMCA from './pages/DMCA';
import TOEICGuide from './pages/TOEICGuide';
import { firebaseTestService } from './services/firebaseTestService';
import SentencePractice from './components/SentencePractice';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    loadGoogleAnalytics?: () => void;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const App: React.FC = () => {
  // Test Firebase connection on app start
  React.useEffect(() => {
    const testFirebase = async () => {
      await firebaseTestService.testConnection();
      await firebaseTestService.testListCollections();
    };
    
    testFirebase();
  }, []);

  const handleCookieAccept = () => {
    // Load Google Analytics when user accepts cookies
    if (window.loadGoogleAnalytics) {
      window.loadGoogleAnalytics();
    }
  };

  const handleCookieDecline = () => {
    // Handle when user declines cookies
    // Optionally track decline event
    if (window.gtag) {
      window.gtag('event', 'cookie_consent_declined');
    }
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Routes with header/footer */}
        <Route
          path="/"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <DictationList />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/vocabulary/:setIndex"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <DictationPractice />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/profile"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Profile />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        {/* Policy Pages */}
        <Route
          path="/about"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <About />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/contact"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Contact />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/terms"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Terms />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/privacy"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Privacy />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/cookies"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Cookies />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/refund"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Refund />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/community"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <Community />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/dmca"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <DMCA />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/toeic-guide"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <TOEICGuide />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        <Route
          path="/not-found"
          element={
            <div className="bg-gray-50 min-h-screen">
              <Header />
              <NotFound />
              <Footer />
              <FloatingFeedback />
            </div>
          }
        />
        
        {/* Authentication routes - no header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin route - no header/footer */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Grammar game route - with header/footer for consistency */}
        <Route
          path="/grammar-game"
          element={
            <div className="bg-gray-50 min-h-screen">
              <GrammarGamePage />
              <FloatingFeedback />
            </div>
          }
        />
        
        {/* Test route for debugging */}
        <Route path="/test" element={<div>Test Route Working!</div>} />
        
        {/* Dictation practice route - no header/footer */}
        <Route
          path="/dictation/:setIndex"
          element={<DictationPractice />}
        />

        <Route
          path="/sentence-practice/:setIndex"
          element={<SentencePractice />}
        />
        
        {/* Catch all other routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <DevelopmentNotice />
      <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
    </AuthProvider>
  );
};

export default App;