import { createSelector, createStructuredSelector } from 'reselect';

import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';

const dateSelector = createSelector(
  uiSearchFiltersSelector,
  filters => filters.date
);

const searchResultsSelector = createStructuredSelector({
  date: dateSelector,
});

export default searchResultsSelector;
