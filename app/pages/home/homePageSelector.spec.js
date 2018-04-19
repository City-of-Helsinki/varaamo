import { expect } from 'chai';
import keyBy from 'lodash/keyBy';

import Purpose from 'utils/fixtures/Purpose';
import { getDefaultRouterProps, getState } from 'utils/testUtils';
import homePageSelector from './homePageSelector';

describe('pages/home/homePageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return homePageSelector(state, props);
  }

  it('returns isFetchingPurposes', () => {
    expect(getSelected().isFetchingPurposes).to.exist;
  });

  describe('purposes', () => {
    function getPurposes(purposes) {
      return getSelected({
        'data.purposes': keyBy(purposes, 'id'),
      }).purposes;
    }

    it('returns an empty array if state contains no purposes', () => {
      expect(getPurposes([])).to.deep.equal([]);
    });

    it('returns an option object for each purpose without a parent', () => {
      const purposes = [
        Purpose.build({ parent: null }),
        Purpose.build({ parent: null }),
      ];
      expect(getPurposes(purposes)).to.have.length(purposes.length);
    });

    it('Does not return an option object for purposes with a parent', () => {
      const purposes = [
        Purpose.build({ parent: 'some parent' }),
      ];
      expect(getPurposes(purposes)).to.have.length(0);
    });

    describe('a returned option object', () => {
      const purpose = Purpose.build({ parent: null });
      function getPurpose() {
        return getPurposes([purpose])[0];
      }

      it('has purpose.id as its value property', () => {
        expect(getPurpose().value).to.equal(purpose.id);
      });

      it('has purpose.name as its label property', () => {
        expect(getPurpose().label).to.equal(purpose.name);
      });

      it('does not contain other properties than value and label', () => {
        const expected = { value: purpose.id, label: purpose.name };
        expect(getPurpose()).to.deep.equal(expected);
      });
    });
  });
});
