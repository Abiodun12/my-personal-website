'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Preferences {
  performanceMode: boolean;
  effectsEnabled: boolean;
  particlesEnabled: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  loading: boolean;
  savePreferences: (prefs: Partial<Preferences>) => Promise<void>;
}

// Default preferences
const defaultPreferences: Preferences = {
  performanceMode: true,
  effectsEnabled: false,
  particlesEnabled: false
};

// Create context
const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  loading: true,
  savePreferences: async () => {}
});

// Hook to use preferences
export const usePreferences = () => useContext(PreferencesContext);

// Provider component
export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Fetch preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch('/api/preferences');
        const data = await res.json();
        
        if (data.success && data.preferences) {
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Save preferences to the database
  const savePreferences = async (newPrefs: Partial<Preferences>) => {
    const updatedPreferences = { ...preferences, ...newPrefs };
    setPreferences(updatedPreferences);
    
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: updatedPreferences })
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, loading, savePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
} 