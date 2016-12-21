import { expect } from 'chai';
import keyBy from 'lodash/keyBy';

import Purpose from 'utils/fixtures/Purpose';
import { getDefaultRouterProps, getState } from 'utils/testUtils';
import searchControlsSelector from './searchControlsSelector';

describe('state/selectors/searchControlsSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return searchControlsSelector(state, props);
  }

  it('returns filters', () => {
    expect(getSelected().filters).to.exist;
  });

  it('returns isFetchingPurposes', () => {
    expect(getSelected().isFetchingPurposes).to.exist;
  });

  describe('purposeOptions', () => {
    function getPurposeOptions(purposes) {
      return getSelected({
        'data.purposes': keyBy(purposes, 'id'),
      }).purposeOptions;
    }

    it('returns an empty array if state contains no purposes', () => {
      expect(getPurposeOptions([])).to.deep.equal([]);
    });

    it('returns an option object for each purpose without a parent', () => {
      const purposes = [
        Purpose.build({ parent: null }),
        Purpose.build({ parent: null }),
      ];
      expect(getPurposeOptions(purposes)).to.have.length(purposes.length);
    });

    it('Does not return an option object for purposes with a parent', () => {
      const purposes = [
        Purpose.build({ parent: 'some parent' }),
      ];
      expect(getPurposeOptions(purposes)).to.have.length(0);
    });

    describe('a returned option object', () => {
      const purpose = Purpose.build({ parent: null });
      function getPurposeOption() {
        return getPurposeOptions([purpose])[0];
      }

      it('has purpose.id as its value property', () => {
        expect(getPurposeOption().value).to.equal(purpose.id);
      });

      it('has purpose.name as its label property', () => {
        expect(getPurposeOption().label).to.equal(purpose.name);
      });

      it('does not contain other properties than value and label', () => {
        const expected = { value: purpose.id, label: purpose.name };
        expect(getPurposeOption()).to.deep.equal(expected);
      });
    });
  });

  it('returns urlSearchFilters', () => {
    expect(getSelected().urlSearchFilters).to.exist;
  });
});
