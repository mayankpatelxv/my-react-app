import { useState, useEffect } from 'react';
import './App.css';
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
    const checkAuthState = async () => {
      console.log('🔍 Checking authentication state...');
      
      // Small delay to ensure localStorage is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const savedUser = localStorage.getItem('bizBuddy_user');
        const savedPage = localStorage.getItem('bizBuddy_currentPage');
        
        console.log('💾 Saved user:', savedUser);
        console.log('📄 Saved page:', savedPage);
        
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
          const userData = JSON.parse(savedUser);
          console.log('✅ User data found:', userData);
          
          // Validate user data structure
          if (userData && userData.id && userData.email) {
            setUser(userData);
            
            // If user is logged in, redirect to dashboard or saved page
            if (savedPage && savedPage !== 'landing' && savedPage !== 'login' && savedPage !== 'register') {
              console.log('🔄 Redirecting to saved page:', savedPage);
              setCurrentPage(savedPage);
            } else {
              console.log('🏠 Redirecting to dashboard');
              setCurrentPage('dashboard');
            }
          } else {
            console.log('❌ Invalid user data structure, clearing localStorage');
            localStorage.removeItem('bizBuddy_user');
            localStorage.removeItem('bizBuddy_currentPage');
            setCurrentPage('landing');
          }
        } else {
          console.log('❌ No saved user found, staying on landing page');
          setCurrentPage('landing');
        }
      } catch (error) {
        console.error('💥 Error checking auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('bizBuddy_user');
        localStorage.removeItem('bizBuddy_currentPage');
        setCurrentPage('landing');
      } finally {
        console.log('⏰ Setting loading to false');
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Save authentication state whenever it changes
  useEffect(() => {
    if (user) {
      console.log('💾 Saving user to localStorage:', user);
      localStorage.setItem('bizBuddy_user', JSON.stringify(user));
    } else {
      console.log('🗑️ Removing user from localStorage');
      localStorage.removeItem('bizBuddy_user');
    }
  }, [user]);

  // Save current page whenever it changes (but not for auth pages)
  useEffect(() => {
    if (currentPage && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register') {
      localStorage.setItem('bizBuddy_currentPage', currentPage);
    }
  }, [currentPage]);

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
    setUser(userData);
    setCurrentPage('dashboard');
    console.log('💾 User data should be saved to localStorage');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    // Clear all saved data on logout
    localStorage.removeItem('bizBuddy_user');
    localStorage.removeItem('bizBuddy_currentPage');
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
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
}

export default App;
