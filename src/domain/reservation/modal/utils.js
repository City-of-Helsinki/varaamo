export const getCancelCategories = (data = [], isAdmin, locale) => {
  return data
    .filter(({ reservation_type: reservationType }) => (
      isAdmin ? true : reservationType === 'own'))
    .map(category => ({
      value: category.id,
      label: category.name[locale || 'fi'],
    }));
};
