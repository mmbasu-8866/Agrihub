import { SupportedLanguage } from './translations';

export const speakText = (text: string, lang: SupportedLanguage = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Match language code
  const langCodeMap: Record<SupportedLanguage, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    pa: 'pa-IN',
  };

  utterance.lang = langCodeMap[lang] || 'hi-IN';
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
