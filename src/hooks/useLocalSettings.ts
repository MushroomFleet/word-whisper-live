import { useState, useEffect } from 'react';
import { Theme } from './useTheme';

export interface AppSettings {
  projectName: string;
  theme: Theme;
  microphoneDeviceId?: string;
  sentencePause: number; // seconds
  paragraphPause: number; // seconds
  sleepMode: number; // seconds
}

const DEFAULT_SETTINGS: AppSettings = {
  projectName: 'Untitled',
  theme: 'modern-dark',
  sentencePause: 1,
  paragraphPause: 3,
  sleepMode: 9,
};

export const useLocalSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('careless-live-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem('careless-live-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
  };
};