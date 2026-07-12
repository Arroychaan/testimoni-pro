import { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

const COOKIE_KEY = 'tp_cookie_consent';

const defaultPreferences = {
  essential: true,     // Always true - cannot be disabled
  analytics: false,
  marketing: false,
};

export function CookieProvider({ children }) {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      // No consent yet - show banner
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs) => {
    const merged = { ...defaultPreferences, ...prefs, essential: true };
    setPreferences(merged);
    localStorage.setItem(COOKIE_KEY, JSON.stringify(merged));
    setShowBanner(false);
  };

  const acceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const acceptEssential = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  return (
    <CookieContext.Provider
      value={{
        preferences,
        showBanner,
        savePreferences,
        acceptAll,
        acceptEssential,
        dismissBanner,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
}