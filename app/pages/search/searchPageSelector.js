import { createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isLoggedInSelector } from 'state/selectors/authSelectors';
import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = state => state.ui.search.searchDone;
const searchResultIdsSelector = state => state.ui.search.results;
const showMapSelector = state => state.ui.search.showMap;
const selectedUnitIdSelector = state => state.ui.search.unitId;
const positionSelector = state => state.ui.search.position;

const searchPageSelector = createStructuredSelector({
  filters: urlSearchFiltersSelector,
  isFetchingSearchResults:
    requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  position: positionSelector,
  searchDone: searchDoneSelector,
  searchResultIds: searchResultIdsSelector,
  selectedUnitId: selectedUnitIdSelector,
  showMap: showMapSelector,
  uiFilters: uiSearchFiltersSelector,
});

export default searchPageSelector;
