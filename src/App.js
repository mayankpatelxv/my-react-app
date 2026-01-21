import { useState, useEffect } from 'react';
import './App.css';
import { SettingsProvider } from './SettingsContext';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import DashboardAnalytics from './DashboardAnalytics';
import PartyManagement from './PartyManagement';
import CreateInvoice from './CreateInvoice';
import AddParty from './AddParty';
import ItemManagement from './ItemManagement';
import AddItem from './AddItem';
import Sales from './Sales';
import Purchases from './Purchases';
import AnnualReports from './AnnualReports';
import Settings from './Settings';

function App() {
  const [currentPage, setCurrentPage] = useState(null); // Start with null to indicate loading
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthState = () => {
      console.log('🔍 Checking authentication state...');
      
      try {
        // Check localStorage immediately without delay
        const savedUser = localStorage.getItem('bizBuddy_user');
        const savedPage = localStorage.getItem('bizBuddy_currentPage');
        
        console.log('💾 Raw saved user:', savedUser);
        console.log('📄 Raw saved page:', savedPage);
        console.log('🔍 All localStorage keys:', Object.keys(localStorage));
        
        // More robust user validation
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined' && savedUser.trim() !== '') {
          try {
            const userData = JSON.parse(savedUser);
            console.log('✅ Parsed user data:', userData);
            
            // Validate user data structure more thoroughly
            if (userData && 
                typeof userData === 'object' && 
                userData.id && 
                userData.email && 
                userData.email.includes('@')) {
              
              console.log('✅ User data is valid, restoring session');
              setUser(userData);
              
              // Restore the saved page or default to dashboard
              if (savedPage && 
                  savedPage !== 'null' && 
                  savedPage !== 'undefined' && 
                  savedPage !== 'landing' && 
                  savedPage !== 'login' && 
                  savedPage !== 'register') {
                console.log('🔄 Restoring saved page:', savedPage);
                setCurrentPage(savedPage);
              } else {
                console.log('🏠 No valid saved page, going to dashboard');
                setCurrentPage('dashboard');
              }
            } else {
              console.log('❌ Invalid user data structure:', userData);
              // Clear invalid data
              localStorage.removeItem('bizBuddy_user');
              localStorage.removeItem('bizBuddy_currentPage');
              setCurrentPage('landing');
            }
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            // Clear corrupted data
            localStorage.removeItem('bizBuddy_user');
            localStorage.removeItem('bizBuddy_currentPage');
            setCurrentPage('landing');
          }
        } else {
          console.log('❌ No valid saved user found');
          setCurrentPage('landing');
        }
      } catch (error) {
        console.error('💥 Error in checkAuthState:', error);
        // Clear all data on error
        try {
          localStorage.removeItem('bizBuddy_user');
          localStorage.removeItem('bizBuddy_currentPage');
        } catch (clearError) {
          console.error('Error clearing localStorage:', clearError);
        }
        setCurrentPage('landing');
      } finally {
        console.log('⏰ Setting loading to false');
        setIsLoading(false);
      }
    };

    // Run immediately
    checkAuthState();
  }, []);

  // Save state before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && user.id && currentPage) {
        try {
          localStorage.setItem('bizBuddy_user', JSON.stringify(user));
          if (currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register') {
            localStorage.setItem('bizBuddy_currentPage', currentPage);
          }
          console.log('💾 State saved before page unload');
        } catch (error) {
          console.error('❌ Error saving state before unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, currentPage]);

  // Save authentication state whenever it changes
  useEffect(() => {
    if (user && user.id && user.email) {
      try {
        const userDataToSave = JSON.stringify(user);
        localStorage.setItem('bizBuddy_user', userDataToSave);
        console.log('💾 User saved to localStorage:', user);
        console.log('💾 Saved data:', userDataToSave);
      } catch (error) {
        console.error('❌ Error saving user to localStorage:', error);
      }
    } else if (user === null) {
      try {
        localStorage.removeItem('bizBuddy_user');
        console.log('🗑️ User removed from localStorage');
      } catch (error) {
        console.error('❌ Error removing user from localStorage:', error);
      }
    }
  }, [user]);

  // Save current page whenever it changes (but not for auth pages)
  useEffect(() => {
    if (currentPage && 
        currentPage !== 'landing' && 
        currentPage !== 'login' && 
        currentPage !== 'register' &&
        user && user.id) { // Only save page if user is logged in
      try {
        localStorage.setItem('bizBuddy_currentPage', currentPage);
        console.log('📄 Page saved to localStorage:', currentPage);
      } catch (error) {
        console.error('❌ Error saving page to localStorage:', error);
      }
    }
  }, [currentPage, user]);

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const switchToRegister = () => {
    setCurrentPage('register');
  };

  const switchToLogin = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (userData) => {
    console.log('🎉 Login successful, user data:', userData);
    
    // Validate user data before saving
    if (userData && userData.id && userData.email) {
      setUser(userData);
      setCurrentPage('dashboard');
      
      // Force immediate save to localStorage
      try {
        localStorage.setItem('bizBuddy_user', JSON.stringify(userData));
        localStorage.setItem('bizBuddy_currentPage', 'dashboard');
        console.log('💾 User data forcefully saved to localStorage');
        console.log('💾 Verification - saved user:', localStorage.getItem('bizBuddy_user'));
        console.log('💾 Verification - saved page:', localStorage.getItem('bizBuddy_currentPage'));
      } catch (error) {
        console.error('❌ Error force-saving to localStorage:', error);
      }
    } else {
      console.error('❌ Invalid user data received from login:', userData);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out user');
    
    // Clear state first
    setUser(null);
    setCurrentPage('landing');
    
    // Clear localStorage with error handling
    try {
      localStorage.removeItem('bizBuddy_user');
      localStorage.removeItem('bizBuddy_currentPage');
      console.log('🗑️ All user data cleared from localStorage');
      
      // Verify cleanup
      console.log('🔍 Verification - user after logout:', localStorage.getItem('bizBuddy_user'));
      console.log('🔍 Verification - page after logout:', localStorage.getItem('bizBuddy_currentPage'));
    } catch (error) {
      console.error('❌ Error clearing localStorage on logout:', error);
    }
  };

  const handleNavigation = (pageName) => {
    switch (pageName) {
      case 'Dashboard':
        setCurrentPage('dashboard');
        break;
      case 'Dashboard & Analytics':
        setCurrentPage('dashboard-analytics');
        break;
      case 'Party Management':
        setCurrentPage('party-management');
        break;
      case 'Create Invoice':
        setCurrentPage('create-invoice');
        break;
      case 'Add Party':
        setCurrentPage('add-party');
        break;
      case 'Item Management':
        setCurrentPage('item-management');
        break;
      case 'Add Item':
        setCurrentPage('add-item');
        break;
      case 'Sales':
        setCurrentPage('sales');
        break;
      case 'Purchases':
        setCurrentPage('purchases');
        break;
      case 'Annual Reports':
        setCurrentPage('annual-reports');
        break;
      case 'Settings':
        setCurrentPage('settings');
        break;
      default:
        setCurrentPage('dashboard');
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <div>Loading BizzBuddy...</div>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <div className="App">
        {currentPage === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        {currentPage === 'login' && (
          <LoginPage 
            onSwitchToRegister={switchToRegister} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {currentPage === 'register' && (
          <RegisterPage onSwitchToLogin={switchToLogin} />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'dashboard-analytics' && (
          <DashboardAnalytics 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'party-management' && (
          <PartyManagement 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'create-invoice' && (
          <CreateInvoice 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'add-party' && (
          <AddParty 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'item-management' && (
          <ItemManagement 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'add-item' && (
          <AddItem 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'sales' && (
          <Sales 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'purchases' && (
          <Purchases 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'annual-reports' && (
          <AnnualReports 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={handleNavigation}
          />
        )}
        {currentPage === 'settings' && (
          <Settings 
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
      </div>
    </SettingsProvider>
  );
}

export default App;
