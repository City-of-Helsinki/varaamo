import orderBy from 'lodash/orderBy';
import { createStructuredSelector, createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isLoggedInSelector } from 'state/selectors/authSelectors';
import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { resourcesSelector } from 'state/selectors/dataSelectors';

const searchDoneSelector = state => state.ui.search.searchDone;
const searchResultIdsSelector = state => state.ui.search.results;
const showMapSelector = state => state.ui.search.showMap;
const selectedUnitIdSelector = state => state.ui.search.unitId;
const positionSelector = state => state.ui.search.position;
const resultCountSelector = state => state.ui.search.resultCount;

const orderedSearchResultIdsSelector = createSelector(
  searchResultIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => {
    const selectedResources = resourceIds.map(id => resources[id]);
    return orderBy(selectedResources, 'distance').map(resource => resource.id);
  }
);

const searchPageSelector = createStructuredSelector({
  filters: urlSearchFiltersSelector,
  isFetchingSearchResults:
    requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  position: positionSelector,
  resultCount: resultCountSelector,
  searchDone: searchDoneSelector,
  searchResultIds: orderedSearchResultIdsSelector,
  selectedUnitId: selectedUnitIdSelector,
  showMap: showMapSelector,
  uiFilters: uiSearchFiltersSelector,
});

export default searchPageSelector;
