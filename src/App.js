import { useState } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

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
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
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
      default:
        setCurrentPage('dashboard');
    }
  };

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
    </div>
  );
}

export default App;
