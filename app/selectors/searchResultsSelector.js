import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';

import { getName } from 'utils/DataUtils';

const resourcesSelector = (state) => state.data.resources;
const resultsSelector = (state) => state.ui.search.results;

const searchResultsSelector = createSelector(
  resourcesSelector,
  resultsSelector,
  (resources, results) => {
    const searchResults = sortBy(
      results.map(resourceId => resources[resourceId]),
      (result) => getName(result)
    );

    return searchResults;
  }
);

export default searchResultsSelector;
