import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

describe('Selectors: searchControlsSelectors', () => {
  let state;

  beforeEach(() => {
    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        purposes: {},
      }),
      ui: Immutable({
        search: {
          filters: {
            date: '2015-10-10',
            purpose: 'some-purpose',
          },
        },
      }),
    };
  });

  it('should return filters', () => {
    const selected = searchControlsSelectors(state);

    expect(selected.filters).to.exist;
  });

  it('should return isFetchingPurposes', () => {
    const selected = searchControlsSelectors(state);

    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeOptions', () => {
    const selected = searchControlsSelectors(state);

    expect(selected.purposeOptions).to.exist;
  });
});
