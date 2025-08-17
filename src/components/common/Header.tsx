import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

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
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.leftSection}>
            {isDictationPage && (
              <button onClick={goBack} className={styles.backButton}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back</span>
              </button>
            )}
            <a href="/" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <img src="/logo.png" alt="Antoree TOEIC" className={styles.logo} />
              </div>
              <div>
                <span className={styles.brandText}>
                  {
                   location.pathname === '/' ? 'T-TOEIC' :
                   location.pathname === '/grammar-game' ? 'Grammar' :
                   location.pathname.startsWith('/dictation-practice') ? 'Dictation' :
                   'Antoeic '}
                </span>
              </div>
            </a>
          </div>

          <div className={styles.navItems}>
              {navItems.map((item) => (
                <a
                  key={item}
                  href={item === 'T-TOEIC' ? '/' : item === 'Grammar' ? '/grammar-game' : '/grammar'}
                  className={`${styles.navItem} ${activeNav === item ? styles.active : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </a>
              ))}
            
            {/* Authentication Section */}
            {currentUser ? (
              <div className={styles.authSection}>
                <span className={styles.userInfo}>
                  <span className={styles.userName}>Hello, </span>
                  <span>{currentUser.fullName || currentUser.email}</span>
                </span>
                <div className={styles.authButtons}>
                  <Link to="/profile" className={styles.profileButton}>
                    <svg className={styles.profileIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.authSection}>
                <Link
                  to="/login"
                  className={styles.loginButton}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={styles.registerButton}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              {!isDictationPage && (
                <div className={styles.mobileNavItems}>
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={item === 'T-TOEIC' ? '/' : item === 'Grammar' ? '/grammar-game' : '/grammar'}
                      className={styles.mobileNavItem}
                      onClick={() => {
                        handleNavClick(item);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
              
              {/* Mobile Authentication Section */}
              {currentUser ? (
                <>
                  <div className={styles.mobileUserInfo}>
                    <span className={styles.userName}>Hello, </span>
                    <span>{currentUser.fullName || currentUser.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className={styles.mobileAuthButton}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={styles.mobileAuthButton}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={styles.mobileAuthButton}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={styles.mobileAuthButton}
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