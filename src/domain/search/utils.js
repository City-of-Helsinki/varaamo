import constants from '../../../app/constants/AppConstants';

export const getFiltersFromUrl = (location) => {
  const query = new URLSearchParams(location.search);
  const filters = {};

  query.forEach((value, key) => {
    if (constants.SUPPORTED_SEARCH_FILTERS[key] !== undefined) {
      filters[key] = value;
    }
  });

  return filters;
};

export const getSearchFromFilters = (filters) => {
  const query = new URLSearchParams(filters);
  return query.toString();
};
