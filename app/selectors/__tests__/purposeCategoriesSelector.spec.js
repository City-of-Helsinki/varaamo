import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import purposeCategoriesSelector from 'selectors/purposeCategoriesSelector';

function getState(purposes) {
  return {
    data: Immutable({
      purposes: _.indexBy(purposes, 'id'),
    }),
  };
}

describe('Selector: purposeCategoriesSelector', () => {
  const mainTypes = ['some-type', 'other-type'];
  const purposes = [
    Purpose.build({ mainType: mainTypes[0] }),
    Purpose.build({ mainType: mainTypes[1] }),
    Purpose.build({ mainType: mainTypes[0] }),
  ];

  it('should return an empty object if there are no purposes in state', () => {
    const state = getState([]);
    const actual = purposeCategoriesSelector(state);

    expect(actual).to.deep.equal({});
  });

  it('should return purposes from the state grouped by mainType', () => {
    const state = getState(purposes);
    const actual = purposeCategoriesSelector(state);
    const expected = Immutable({
      [mainTypes[0]]: [purposes[0], purposes[2]],
      [mainTypes[1]]: [purposes[1]],
    });

    expect(actual).to.deep.equal(expected);
  });
});
