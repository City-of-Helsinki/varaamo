import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

describe('Selectors: searchControlsSelectors', () => {
  const purposes = [
    Purpose.build(),
    Purpose.build(),
  ];
  const state = {
    api: Immutable({
      isFetchingPurposes: false,
    }),
    data: Immutable({
      purposes: {
        [purposes[0].id]: purposes[0],
        [purposes[1].id]: purposes[1],
      },
    }),
    ui: Immutable({
      search: {
        purposeFilter: 'some-filter',
      },
    }),
  };

  describe('selected values', () => {
    it('should return isFetchingPurposes from the state', () => {
      const selected = searchControlsSelectors(state);
      const expected = state.api.isFetchingPurposes;

      expect(selected.isFetchingPurposes).to.equal(expected);
    });

    it('should return objects containing values and labels as purposeOptions', () => {
      const selected = searchControlsSelectors(state);
      const expected = Immutable([
        { value: purposes[0].id, label: purposes[0].name.fi },
        { value: purposes[1].id, label: purposes[1].name.fi },
      ]);

      expect(selected.purposeOptions).to.deep.equal(expected);
    });

    it('should return purposeFilter from the state', () => {
      const selected = searchControlsSelectors(state);
      const expected = state.ui.search.purposeFilter;

      expect(selected.purposeFilter).to.deep.equal(expected);
    });
  });
});
