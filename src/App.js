import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import DemandForecasting from './DemandForecasting';
import Settings from './Settings';

// Protected Route Component
function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// App Content Component (handles navigation logic)
function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('bizBuddy_user');
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
          const userData = JSON.parse(savedUser);
          if (userData && userData.id && userData.email) {
            console.log('✅ User authenticated:', userData.email);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const switchToRegister = () => {
    navigate('/register');
  };

  const switchToLogin = () => {
    navigate('/login');
  };

  const handleLoginSuccess = (userData) => {
    console.log('🎉 Login successful, user data:', userData);
    
    if (userData && userData.id && userData.email) {
      setUser(userData);
      
      try {
        localStorage.setItem('bizBuddy_user', JSON.stringify(userData));
        console.log('💾 User data saved to localStorage');
      } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
      }
      
      navigate('/dashboard');
    } else {
      console.error('❌ Invalid user data received from login:', userData);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out user');
    
    setUser(null);
    
    try {
      localStorage.removeItem('bizBuddy_user');
      console.log('🗑️ User data cleared from localStorage');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
    
    navigate('/');
  };

  const handleNavigation = (pageName) => {
    const routeMap = {
      'Dashboard': '/dashboard',
      'Dashboard & Analytics': '/dashboard-analytics',
      'Party Management': '/party-management',
      'Create Invoice': '/create-invoice',
      'Add Party': '/add-party',
      'Item Management': '/item-management',
      'Add Item': '/add-item',
      'Sales': '/sales',
      'Purchases': '/purchases',
      'Annual Reports': '/annual-reports',
      'Demand Forecasting': '/demand-forecasting',
      'Settings': '/settings'
    };
    
    const route = routeMap[pageName] || '/dashboard';
    navigate(route);
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading BizBuddy...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage 
              onSwitchToRegister={switchToRegister} 
              onLoginSuccess={handleLoginSuccess}
            />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage onSwitchToLogin={switchToLogin} />
          )
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard-analytics" 
        element={
          <ProtectedRoute user={user}>
            <DashboardAnalytics user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/party-management" 
        element={
          <ProtectedRoute user={user}>
            <PartyManagement user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute user={user}>
            <CreateInvoice user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-party" 
        element={
          <ProtectedRoute user={user}>
            <AddParty user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/item-management" 
        element={
          <ProtectedRoute user={user}>
            <ItemManagement user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-item" 
        element={
          <ProtectedRoute user={user}>
            <AddItem user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sales" 
        element={
          <ProtectedRoute user={user}>
            <Sales user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/purchases" 
        element={
          <ProtectedRoute user={user}>
            <Purchases user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/annual-reports" 
        element={
          <ProtectedRoute user={user}>
            <AnnualReports user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/demand-forecasting" 
        element={
          <ProtectedRoute user={user}>
            <DemandForecasting user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute user={user}>
            <Settings 
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigation}
              onBack={() => navigate('/dashboard')}
            />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter basename="/my-react-app">
        <div className="App">
          <AppContent />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
