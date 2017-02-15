import { createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isLoggedInSelector } from 'state/selectors/authSelectors';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = state => state.ui.search.searchDone;
const searchResultIdsSelector = state => state.ui.search.results;

const searchPageSelector = createStructuredSelector({
  filters: urlSearchFiltersSelector,
  isFetchingSearchResults:
    requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  searchDone: searchDoneSelector,
  searchResultIds: searchResultIdsSelector,
});

export default searchPageSelector;
