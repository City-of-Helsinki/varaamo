import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const searchResultIds = ['resource-1', 'resource-2'];

  function getSelected(extraState) {
    const state = getState({
      'ui.search': {
        resultCount: 2,
        results: searchResultIds,
      },
      'data.resources': {
        'resource-1': {
          id: 'resource-1',
        },
        'resource-2': {
          id: 'resource-2',
        },
      },
      ...extraState,
    });
    const props = getDefaultRouterProps();
    return searchPageSelector(state, props);
  }

  test('returns filters', () => {
    expect(getSelected().filters).to.exist;
  });

  test('returns isFetchingSearchResults', () => {
    expect(getSelected().isFetchingSearchResults).to.exist;
  });

  test('returns isLoggedIn', () => {
    expect(getSelected().isLoggedIn).to.exist;
  });

  test('returns resultCount', () => {
    expect(getSelected().resultCount).to.deep.equal(2);
  });

  test('returns searchDone', () => {
    expect(getSelected().searchDone).to.exist;
  });

  test('returns searchResultIds', () => {
    expect(getSelected().searchResultIds).to.deep.equal(searchResultIds);
  });

  test('returns searchResultIds ordered by distance', () => {
    expect(getSelected({
      'data.resources': {
        'resource-1': {
          id: 'resource-1',
          distance: 4000,
        },
        'resource-2': {
          id: 'resource-2',
          distance: 2000,
        },
      },
    }).searchResultIds).to.deep.equal(['resource-2', 'resource-1']);
  });

  test('returns showMap', () => {
    expect(getSelected().showMap).to.exist;
  });

  test('returns selectedUnitId', () => {
    expect(getSelected().selectedUnitId).to.equal(null);
  });

  test('returns uiFilters', () => {
    expect(getSelected().uiFilters).to.exist;
  });
});
