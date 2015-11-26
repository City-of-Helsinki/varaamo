import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';

function getState(purposes) {
  return {
    data: Immutable({
      purposes: _.indexBy(purposes, 'id'),
    }),
  };
}

describe('Selector: purposeOptionsSelector', () => {
  const purposes = [
    Purpose.build(),
    Purpose.build(),
  ];

  it('should return an empty array if state contains no purposes', () => {
    const state = getState([]);
    const actual = purposeOptionsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('should return an option object for each purpose with a parent', () => {
    const state = getState(purposes);
    const actual = purposeOptionsSelector(state);

    expect(actual.length).to.equal(purposes.length);
  });

  it('should not return an option object for purposes without a parent', () => {
    const parentlessPurpose = Purpose.build({ parent: null });
    const state = getState([parentlessPurpose]);
    const actual = purposeOptionsSelector(state);

    expect(actual.length).to.equal(0);
  });

  describe('a returned option object', () => {
    const purpose = purposes[0];
    const state = getState([purpose]);
    const option = purposeOptionsSelector(state)[0];

    it('should have purpose.id as its value property', () => {
      expect(option.value).to.equal(purpose.id);
    });

    it('should have purpose.name.fi as its label property', () => {
      expect(option.label).to.equal(purpose.name.fi);
    });

    it('should not contain other properties than value and label', () => {
      const expected = { value: purpose.id, label: purpose.name.fi };

      expect(option).to.deep.equal(expected);
    });
  });

  it('should work for multiple purposes', () => {
    const state = getState(purposes);
    const actual = purposeOptionsSelector(state);
    const expected = Immutable([
      { value: purposes[0].id, label: purposes[0].name.fi },
      { value: purposes[1].id, label: purposes[1].name.fi },
    ]);

    expect(actual).to.deep.equal(expected);
  });
});
