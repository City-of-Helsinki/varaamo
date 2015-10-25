import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import searchResultsSelector from 'selectors/searchResultsSelector';

function getState(resources, results = []) {
  return {
    data: Immutable({
      resources: _.indexBy(resources, 'id'),
    }),
    ui: Immutable({
      search: {
        results,
      },
    }),
  };
}

describe('Selector: searchResultsSelector', () => {
  const resources = [
    Resource.build(),
    Resource.build(),
  ];

  it('should return an empty string if results in state is empty', () => {
    const results = [];
    const state = getState(resources, results);
    const actual = searchResultsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('should return resources corresponding to ids in search.results', () => {
    const results = [resources[0].id, resources[1].id];
    const state = getState(resources, results);
    const actual = searchResultsSelector(state);
    const expected = [resources[0], resources[1]];

    expect(actual).to.deep.equal(expected);
  });

  it('should not return resources not specified in results', () => {
    const results = [resources[0].id];
    const state = getState(resources, results);
    const actual = searchResultsSelector(state);
    const expected = [resources[0]];

    expect(actual).to.deep.equal(expected);
  });

  it('should return the results in alphabetical order', () => {
    const unsortedResults = [resources[1].id, resources[0].id];
    const state = getState(resources, unsortedResults);
    const actual = searchResultsSelector(state);
    const expected = [resources[0], resources[1]];

    expect(actual).to.deep.equal(expected);
  });
});
