import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Purpose from 'fixtures/Purpose';
import { purposeCategoryListSelectors } from 'selectors/purposeCategoryListSelectors';

describe('Selectors: purposeCategoryListSelectors', () => {
  let purposes;
  let state;

  beforeEach(() => {
    purposes = [
      Purpose.build({ mainType: 'some-type' }),
      Purpose.build({ mainType: 'other-type' }),
      Purpose.build({ mainType: 'some-type' }),
    ];

    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        purposes: _.indexBy(purposes, 'id'),
      }),
    };
  });

  describe('isFetchingPurposes', () => {
    it('should return true if PURPOSES_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.PURPOSES_GET_REQUEST];
      const selected = purposeCategoryListSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(true);
    });

    it('should return false if PURPOSES_GET_REQUEST is not in activeRequests', () => {
      const selected = purposeCategoryListSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(false);
    });
  });

  it('should return purposes grouped by mainType from the state', () => {
    const selected = purposeCategoryListSelectors(state);
    const expected = Immutable({
      [purposes[0].mainType]: [
        purposes[0],
        purposes[2],
      ],
      [purposes[1].mainType]: [
        purposes[1],
      ],
    });

    expect(selected.purposeCategories).to.deep.equal(expected);
  });
});
