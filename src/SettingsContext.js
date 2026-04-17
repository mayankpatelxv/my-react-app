import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'english',
    currency: localStorage.getItem('currency') || 'USD',
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    autoSave: JSON.parse(localStorage.getItem('autoSave') || 'true'),
    compactView: JSON.parse(localStorage.getItem('compactView') || 'false'),
    dateFormat: localStorage.getItem('dateFormat') || 'DD/MM/YYYY',
    timeFormat: localStorage.getItem('timeFormat') || '24h'
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply compact view class
    if (settings.compactView) {
      document.body.classList.add('compact-view');
    } else {
      document.body.classList.remove('compact-view');
    }
  }, [settings.theme, settings.compactView]);

  const updateSetting = (key, value) => {
    console.log('updateSetting called with:', key, value); // Debug log
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(key, typeof value === 'boolean' ? JSON.stringify(value) : value);
    
    // Apply immediate changes
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    }
    
    if (key === 'compactView') {
      console.log('Compact view setting changed to:', value); // Debug log
      console.log('Current body classes before change:', document.body.className); // Debug log
      
      if (value) {
        document.body.classList.add('compact-view');
        console.log('Added compact-view class to body'); // Debug log
      } else {
        document.body.classList.remove('compact-view');
        console.log('Removed compact-view class from body'); // Debug log
      }
      
      // Force a small delay to ensure the class is applied
      setTimeout(() => {
        console.log('Body classes after change:', document.body.className); // Debug log
        console.log('Compact view class present:', document.body.classList.contains('compact-view')); // Debug log
      }, 100);
    }
  };

  // Currency formatting function
  const formatCurrency = (amount, showSymbol = true) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥'
    };

    const locales = {
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
      INR: 'en-IN',
      JPY: 'ja-JP'
    };

    const symbol = currencySymbols[settings.currency] || '$';
    const locale = locales[settings.currency] || 'en-US';
    
    const formattedAmount = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return showSymbol ? `${symbol}${formattedAmount}` : formattedAmount;
  };

  // Date formatting function
  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    switch (settings.dateFormat) {
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      case 'DD/MM/YYYY':
      default:
        return dateObj.toLocaleDateString('en-GB');
    }
  };

  // Time formatting function
  const formatTime = (date) => {
    const dateObj = new Date(date);
    
    if (settings.timeFormat === '12h') {
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  };

  // Get language-specific text
  const getText = (key) => {
    const translations = {
      english: {
        dashboard: 'Dashboard',
        sales: 'Sales',
        purchases: 'Purchases',
        items: 'Items',
        parties: 'Parties',
        reports: 'Annual Reports',
        settings: 'Settings',
        logout: 'Logout',
        welcome: 'Welcome back',
        totalSales: 'Total Sales',
        totalPurchases: 'Total Purchases',
        totalItems: 'Total Items',
        totalParties: 'Total Parties',
        quickActions: 'Quick Actions',
        recentActivity: 'Recent Activity'
      },
      spanish: {
        dashboard: 'Panel de Control',
        sales: 'Ventas',
        purchases: 'Compras',
        items: 'Artículos',
        parties: 'Partes',
        reports: 'Informes Anuales',
        settings: 'Configuración',
        logout: 'Cerrar Sesión',
        welcome: 'Bienvenido de nuevo',
        totalSales: 'Ventas Totales',
        totalPurchases: 'Compras Totales',
        totalItems: 'Artículos Totales',
        totalParties: 'Partes Totales',
        quickActions: 'Acciones Rápidas',
        recentActivity: 'Actividad Reciente'
      },
      french: {
        dashboard: 'Tableau de Bord',
        sales: 'Ventes',
        purchases: 'Achats',
        items: 'Articles',
        parties: 'Parties',
        reports: 'Rapports Annuels',
        settings: 'Paramètres',
        logout: 'Déconnexion',
        welcome: 'Bon retour',
        totalSales: 'Ventes Totales',
        totalPurchases: 'Achats Totaux',
        totalItems: 'Articles Totaux',
        totalParties: 'Parties Totales',
        quickActions: 'Actions Rapides',
        recentActivity: 'Activité Récente'
      },
      german: {
        dashboard: 'Dashboard',
        sales: 'Verkäufe',
        purchases: 'Einkäufe',
        items: 'Artikel',
        parties: 'Parteien',
        reports: 'Jahresberichte',
        settings: 'Einstellungen',
        logout: 'Abmelden',
        welcome: 'Willkommen zurück',
        totalSales: 'Gesamtumsatz',
        totalPurchases: 'Gesamteinkäufe',
        totalItems: 'Gesamtartikel',
        totalParties: 'Gesamtparteien',
        quickActions: 'Schnellaktionen',
        recentActivity: 'Letzte Aktivität'
      },
      hindi: {
        dashboard: 'डैशबोर्ड',
        sales: 'बिक्री',
        purchases: 'खरीदारी',
        items: 'वस्तुएं',
        parties: 'पार्टियां',
        reports: 'वार्षिक रिपोर्ट',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        welcome: 'वापसी पर स्वागत',
        totalSales: 'कुल बिक्री',
        totalPurchases: 'कुल खरीदारी',
        totalItems: 'कुल वस्तुएं',
        totalParties: 'कुल पार्टियां',
        quickActions: 'त्वरित क्रियाएं',
        recentActivity: 'हाल की गतिविधि'
      }
    };

    return translations[settings.language]?.[key] || translations.english[key] || key;
  };

  const value = {
    settings,
    updateSetting,
    formatCurrency,
    formatDate,
    formatTime,
    getText
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};