import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import { homePageSelectors } from 'selectors/homePageSelectors';

describe('Selectors: homePageSelectors', () => {
  const purposes = [
    Purpose.build({ mainType: 'some-type' }),
    Purpose.build({ mainType: 'other-type' }),
    Purpose.build({ mainType: 'some-type' }),
  ];
  const state = {
    api: Immutable({
      isFetchingPurposes: false,
    }),
    data: Immutable({
      purposes: _.indexBy(purposes, 'id'),
    }),
  };

  describe('selected values', () => {
    it('should return isFetchingPurposes from the state', () => {
      const selected = homePageSelectors(state);
      const expected = state.api.isFetchingPurposes;

      expect(selected.isFetchingPurposes).to.equal(expected);
    });

    it('should return purposes grouped by mainType from the state', () => {
      const selected = homePageSelectors(state);
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
});
