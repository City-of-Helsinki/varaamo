export const loadPersistedLocale = () => {
  try {
    const locale = localStorage.getItem('userLocale');
    if (locale === null) {
      return undefined;
    }

    return locale;
  } catch (err) {
    return undefined;
  }
};

export const savePersistLocale = (locale) => {
  try {
    return locale && typeof locale === 'string'
      ? localStorage.setItem('userLocale', locale)
      : undefined;
  } catch (err) {
    return undefined;
  }
};
