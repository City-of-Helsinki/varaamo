import _ from 'lodash';
import { createSelector } from 'reselect';

const resourcesSelector = (state) => state.data.resources;
const resultsSelector = (state) => state.ui.search.results;

const searchResultsSelector = createSelector(
  resourcesSelector,
  resultsSelector,
  (resources, results) => {
    const searchResults = _.sortBy(
      results.map(resourceId => resources[resourceId]),
      (result) => result.name.fi
    );

    return searchResults;
  }
);

export default searchResultsSelector;
