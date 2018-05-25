import { createSelector, createStructuredSelector } from 'reselect';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

const dateSelector = createSelector(
  urlSearchFiltersSelector,
  filters => filters.date
);

const searchResultsSelector = createStructuredSelector({
  date: dateSelector,
});

export default searchResultsSelector;
