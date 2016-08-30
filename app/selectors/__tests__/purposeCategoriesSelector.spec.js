import { expect } from 'chai';

import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import purposeCategoriesSelector from 'selectors/purposeCategoriesSelector';

function getState(purposes) {
  return {
    data: Immutable({
      purposes: keyBy(purposes, 'id'),
    }),
  };
}

describe('Selector: purposeCategoriesSelector', () => {
  const purposes = [
    Purpose.build({ parent: null }),
    Purpose.build({ parent: 'some-parent' }),
    Purpose.build({ parent: null }),
  ];

  it('should return an empty object if there are no purposes in state', () => {
    const state = getState([]);
    const actual = purposeCategoriesSelector(state);

    expect(actual).to.deep.equal({});
  });

  it('should return only purposes without a parent', () => {
    const state = getState(purposes);
    const actual = purposeCategoriesSelector(state);
    const expected = Immutable({
      [purposes[0].id]: purposes[0],
      [purposes[2].id]: purposes[2],
    });

    expect(actual).to.deep.equal(expected);
  });
});
