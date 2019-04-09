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
    expect(getSelected().filters).toBeDefined();
  });

  test('returns isFetchingSearchResults', () => {
    expect(getSelected().isFetchingSearchResults).toBeDefined();
  });

  test('returns isLoggedIn', () => {
    expect(getSelected().isLoggedIn).toBeDefined();
  });

  test('returns resultCount', () => {
    expect(getSelected().resultCount).toEqual(2);
  });

  test('returns searchDone', () => {
    expect(getSelected().searchDone).toBeDefined();
  });

  test('returns searchResultIds', () => {
    expect(getSelected().searchResultIds).toEqual(searchResultIds);
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
    }).searchResultIds).toEqual(['resource-2', 'resource-1']);
  });

  test('returns showMap', () => {
    expect(getSelected().showMap).toBeDefined();
  });

  test('returns selectedUnitId', () => {
    expect(getSelected().selectedUnitId).toBeNull();
  });

  test('returns uiFilters', () => {
    expect(getSelected().uiFilters).toBeDefined();
  });
});
