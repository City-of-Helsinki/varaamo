import { createStructuredSelector } from 'reselect';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

const searchResultsSelector = createStructuredSelector({
  filters: urlSearchFiltersSelector,
});

export default searchResultsSelector;
