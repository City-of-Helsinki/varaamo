import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import searchControlsSelector from 'selectors/containers/searchControlsSelector';

describe('Selector: searchControlsSelector', () => {
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
    const selected = searchControlsSelector(state);

    expect(selected.filters).to.exist;
  });

  it('should return isFetchingPurposes', () => {
    const selected = searchControlsSelector(state);

    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeOptions', () => {
    const selected = searchControlsSelector(state);

    expect(selected.purposeOptions).to.exist;
  });
});
