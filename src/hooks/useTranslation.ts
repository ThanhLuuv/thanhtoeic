import { useState } from 'react';

export const useTranslation = () => {
  const [translatedChoices, setTranslatedChoices] = useState<{ [key: string]: boolean }>({});

  const toggleTranslation = (choiceKey: string) => {
    setTranslatedChoices(prev => ({
      ...prev,
      [choiceKey]: !prev[choiceKey]
    }));
  };

  const isTranslated = (choiceKey: string) => {
    return translatedChoices[choiceKey] || false;
  };

  const resetTranslations = () => {
    setTranslatedChoices({});
  };

  return {
    translatedChoices,
    toggleTranslation,
    isTranslated,
    resetTranslations
  };
};
