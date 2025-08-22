import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dictation');
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
    if (item === 'Dictation') {
      navigate('/');
    } else if (item === 'Grammar') {
      navigate('/grammar-game');
    }
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

  // Close more menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMoreMenuOpen && !(event.target as Element).closest(`.${styles.moreMenuContainer}`)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

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
            <Link to="https://antoree.com" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <img src="/logo.png" alt="Antoree TOEIC" className={styles.logo} />
              </div>
              <div>
                <span className={styles.brandText}>
                  {
                   location.pathname === '/' ? 'AntToeic' :
                   location.pathname === '/grammar-game' ? 'Grammar' :
                   location.pathname.startsWith('/dictation-practice') ? 'Dictation' :
                   'Antoeic '}
                </span>
              </div>
            </Link>
          </div>

          <div className={styles.navItems}>
              {navItems.map((item) => (
                <button
                  key={item}
                  className={`${styles.navItem} ${activeNav === item ? styles.active : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </button>
              ))}
            
            {/* More Menu Dropdown */}
            <div className={styles.moreMenuContainer}>
              <button
                className={`${styles.navItem} ${styles.moreButton}`}
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                onMouseEnter={() => setIsMoreMenuOpen(true)}
              >
                More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isMoreMenuOpen && (
                <div 
                  className={styles.moreDropdown}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  <div className={styles.dropdownSection}>
                    <h4 className={styles.dropdownTitle}>Company</h4>
                    <Link to="/about" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      About Us
                    </Link>
                    <Link to="/contact" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      Contact
                    </Link>
                  </div>
                  
                  <div className={styles.dropdownSection}>
                    <h4 className={styles.dropdownTitle}>Legal</h4>
                    <Link to="/terms" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      Terms of Service
                    </Link>
                    <Link to="/privacy" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      Privacy Policy
                    </Link>
                    <Link to="/cookies" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      Cookie Policy
                    </Link>
                    <Link to="/refund" className={styles.dropdownItem} onClick={() => setIsMoreMenuOpen(false)}>
                      Refund Policy
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
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
                    <button
                      key={item}
                      className={styles.mobileNavItem}
                      onClick={() => {
                        handleNavClick(item);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Mobile Legal Links */}
              <div className={styles.mobileLegalSection}>
                <h4 className={styles.mobileSectionTitle}>Company</h4>
                <Link
                  to="/about"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <h4 className={styles.mobileSectionTitle}>Legal</h4>
                <Link
                  to="/terms"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/cookies"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cookie Policy
                </Link>
                <Link
                  to="/refund"
                  className={styles.mobileLegalLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Refund Policy
                </Link>
              </div>
              
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