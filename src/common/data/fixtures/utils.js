export const getLocalizedFieldSequenceGeneratorFunction = (
  fieldValue,
  locales = ['en', 'fi', 'sv']
) => {
  return (i) => {
    const value = {};
    locales.forEach((locale) => {
      value[locale] = `${fieldValue} (${locale}) - ${i}`;
    });
    return value;
  };
};
