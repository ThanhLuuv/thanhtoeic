import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Luyện đề');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = ['Dictation', 'Grammar'];

  // Xác định menu active dựa trên current location
  React.useEffect(() => {
    if (location.pathname === '/') {
      setActiveNav('Dictation');
    } else if (location.pathname === '/grammar-game') {
      setActiveNav('Grammar');
    }
  }, [location.pathname]);

  const handleNavClick = (item: string) => {
    setActiveNav(item);
  };

  const goBack = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
  };
  const isDictationPage = location.pathname.includes('/vocabulary') ||location.pathname === '/grammar-game' || location.pathname.includes('/dictation-list') || location.pathname.includes('/dictation-practice/');

  return (
    <header className="gradient-bg-header shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isDictationPage && (
              <button onClick={goBack} className="back-btn text-black hover:text-gray-700 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back</span>
              </button>
            )}
            <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Antoree TOEIC" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-black text-xl">
                  {
                   location.pathname === '/' ? 'Dictation' :
                   location.pathname === '/grammar-game' ? 'Grammar' :
                   location.pathname.startsWith('/dictation-practice') ? 'Dictation' :
                   'Antoeic '}
                </span>
              </div>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={item === 'Dictation' ? '/' : item === 'Grammar' ? '/grammar-game' : '/grammar'}
                  className={`nav-item text-black font-medium px-4 py-2 transition-all duration-300 ${activeNav === item ? 'border-b-2 border-green-600' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </a>
              ))}
            
            {/* Authentication Section */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-black/90 text-sm">
                  <span className="font-semibold">Hello, </span>
                  <span>{currentUser.fullName || currentUser.email}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/30 transition-all">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-black hover:text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-black hover:text-gray-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg mt-4 shadow-lg">
              {!isDictationPage && (
                <>
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={item === 'Dictation' ? '/' : item === 'Grammar' ? '/grammar-game' : '/grammar'}
                      className="block px-3 py-2 text-black font-medium hover:bg-green-100 rounded-md transition-colors"
                      onClick={() => {
                        handleNavClick(item);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </>
              )}
              
              {/* Mobile Authentication Section */}
              {currentUser ? (
                <>
                  <div className="px-3 py-2 text-black/90 text-sm border-t border-gray-200">
                    <span className="font-semibold">Hello, </span>
                    <span>{currentUser.fullName || currentUser.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-black font-medium hover:bg-green-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-black font-medium hover:bg-green-100 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-black font-medium hover:bg-green-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-black font-medium hover:bg-green-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;