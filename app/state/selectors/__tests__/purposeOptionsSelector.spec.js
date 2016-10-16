import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Purpose from 'utils/fixtures/Purpose';
import purposeOptionsSelector from 'state/selectors/purposeOptionsSelector';

function getState(purposes) {
  return {
    data: Immutable({
      purposes: keyBy(purposes, 'id'),
    }),
  };
}

describe('Selector: purposeOptionsSelector', () => {
  const purposes = [
    Purpose.build({ parent: null }),
    Purpose.build({ parent: null }),
  ];

  it('returns an empty array if state contains no purposes', () => {
    const state = getState([]);
    const actual = purposeOptionsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('returns an option object for each purpose without a parent', () => {
    const state = getState(purposes);
    const actual = purposeOptionsSelector(state);

    expect(actual.length).to.equal(purposes.length);
  });

  it('Does not return an option object for purposes with a parent', () => {
    const parentlessPurpose = Purpose.build({ parent: 'some parent' });
    const state = getState([parentlessPurpose]);
    const actual = purposeOptionsSelector(state);

    expect(actual.length).to.equal(0);
  });

  describe('a returned option object', () => {
    const purpose = purposes[0];
    const state = getState([purpose]);
    const option = purposeOptionsSelector(state)[0];

    it('has purpose.id as its value property', () => {
      expect(option.value).to.equal(purpose.id);
    });

    it('has purpose.name.fi as its label property', () => {
      expect(option.label).to.equal(purpose.name.fi);
    });

    it('does not contain other properties than value and label', () => {
      const expected = { value: purpose.id, label: purpose.name.fi };

      expect(option).to.deep.equal(expected);
    });
  });

  it('works for multiple purposes', () => {
    const state = getState(purposes);
    const actual = purposeOptionsSelector(state);
    const expected = Immutable([
      { value: purposes[0].id, label: purposes[0].name.fi },
      { value: purposes[1].id, label: purposes[1].name.fi },
    ]);

    expect(actual).to.deep.equal(expected);
  });
});
