import { expect } from 'chai';

import moment from 'moment';
import Immutable from 'seamless-immutable';

import { DATE_FORMAT } from 'constants/AppConstants';
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
          filters: {
            date: '2015-10-10',
            purpose: 'some-purpose',
          },
        },
      }),
    };
  });

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

  describe('filters', () => {
    it('should return filters from the state', () => {
      const selected = searchControlsSelectors(state);
      const expected = state.ui.search.filters;

      expect(selected.filters).to.deep.equal(expected);
    });

    it('should return current date as date filter if date is an empty string in state', () => {
      state.ui.search.filters.date = '';
      const selected = searchControlsSelectors(state);
      const filters = state.ui.search.filters;
      const expectedDate = moment().format(DATE_FORMAT);
      const expected = Object.assign({}, filters, { date: expectedDate });

      expect(selected.filters).to.deep.equal(expected);
    });
  });
});
