import React, { createContext, useContext, useState } from 'react';
import { SupportedLanguage, TRANSLATIONS, LANGUAGES, LanguageOption } from '../utils/translations';
import { speakText, stopSpeech } from '../utils/speech';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: LanguageOption[];
  t: (key: string) => string;
  isEasyMode: boolean;
  setIsEasyMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  speak: (text: string) => void;
  stopVoice: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English as requested
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const speak = (text: string) => {
    speakText(text, language);
  };

  const stopVoice = () => {
    stopSpeech();
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: LANGUAGES,
        t,
        isEasyMode,
        setIsEasyMode,
        speak,
        stopVoice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
