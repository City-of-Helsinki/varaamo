import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Purpose from 'fixtures/Purpose';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

describe('Selectors: searchControlsSelectors', () => {
  let purposes;
  let state;

  beforeEach(() => {
    purposes = [
      Purpose.build(),
      Purpose.build(),
    ];

    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        purposes: {
          [purposes[0].id]: purposes[0],
          [purposes[1].id]: purposes[1],
        },
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

  describe('isFetchingPurposes', () => {
    it('should return true if PURPOSES_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.PURPOSES_GET_REQUEST];
      const selected = searchControlsSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(true);
    });

    it('should return false if PURPOSES_GET_REQUEST is not in activeRequests', () => {
      const selected = searchControlsSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(false);
    });
  });

  it('should return objects containing values and labels as purposeOptions', () => {
    const selected = searchControlsSelectors(state);
    const expected = Immutable([
      { value: purposes[0].id, label: purposes[0].name.fi },
      { value: purposes[1].id, label: purposes[1].name.fi },
    ]);

    expect(selected.purposeOptions).to.deep.equal(expected);
  });
});
