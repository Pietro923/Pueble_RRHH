import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from "@/lib/supabaseConfig";
import i18n from '@/lib/i18n';

type ThemeMode = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'normal' | 'large';
type Language = 'es' | 'en' | 'fr';

interface ThemeSettings {
  mode: ThemeMode;
  fontSize: FontSize;
  animations: boolean;
}

interface LanguageSettings {
  preferred: Language;
}

interface AppSettings {
  theme: ThemeSettings;
  language: LanguageSettings;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  applyTheme: (mode: ThemeMode) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: {
      mode: 'system',
      fontSize: 'normal',
      animations: true,
    },
    language: {
      preferred: 'es',
    },
  });

  // Cambiar idioma automáticamente
  useEffect(() => {
    i18n.changeLanguage(settings.language.preferred);
  }, [settings.language.preferred]);

  // Cargar settings desde Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: userData, error: userError } = await auth.getUser();

        if (userError || !userData?.user) return;

        const { data: userSettingsData, error: settingsError } = await db
          .from("users")
          .select("settings")
          .eq("id", userData.user.id)
          .single();

        if (settingsError) {
          console.error("Error fetching settings:", settingsError);
          return;
        }

        if (userSettingsData?.settings) {
          setSettings(userSettingsData.settings);
        }
      } catch (error) {
        console.error("Unexpected error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;

    let effectiveMode = mode;
    if (mode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.remove('dark', 'light');
    root.classList.add(effectiveMode);

    const fontSizeMap = {
      'small': '0.875rem',
      'normal': '1rem',
      'large': '1.125rem',
    };
    root.style.fontSize = fontSizeMap[settings.theme.fontSize];
  };

  useEffect(() => {
    applyTheme(settings.theme.mode);
  }, [settings.theme.mode, settings.theme.fontSize]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSettings, applyTheme }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
