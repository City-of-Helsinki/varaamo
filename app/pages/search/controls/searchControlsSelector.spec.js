import keyBy from 'lodash/keyBy';

import Purpose from '../../../utils/fixtures/Purpose';
import Unit from '../../../utils/fixtures/Unit';
import { getDefaultRouterProps, getState } from '../../../utils/testUtils';
import searchControlsSelector from './searchControlsSelector';

describe('pages/search/controls/searchControlsSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return searchControlsSelector(state, props);
  }

  test('returns filters', () => {
    expect(getSelected().filters).toBeDefined();
  });

  test('returns isFetchingPurposes', () => {
    expect(getSelected().isFetchingPurposes).toBeDefined();
  });

  describe('purposeOptions', () => {
    function getPurposeOptions(purposes) {
      return getSelected({
        'data.purposes': keyBy(purposes, 'id'),
      }).purposeOptions;
    }

    test('returns an empty array if state contains no purposes', () => {
      expect(getPurposeOptions([])).toEqual([]);
    });

    test('returns an option object for each purpose without a parent', () => {
      const purposes = [
        Purpose.build({ parent: null }),
        Purpose.build({ parent: null }),
      ];
      expect(getPurposeOptions(purposes)).toHaveLength(purposes.length);
    });

    test('Does not return an option object for purposes with a parent', () => {
      const purposes = [
        Purpose.build({ parent: 'some parent' }),
      ];
      expect(getPurposeOptions(purposes)).toHaveLength(0);
    });

    describe('a returned option object', () => {
      const purpose = Purpose.build({ parent: null });
      function getPurposeOption() {
        return getPurposeOptions([purpose])[0];
      }

      test('has purpose.id as its value property', () => {
        expect(getPurposeOption().value).toBe(purpose.id);
      });

      test('has purpose.name as its label property', () => {
        expect(getPurposeOption().label).toBe(purpose.name);
      });

      test('does not contain other properties than value and label', () => {
        const expected = { value: purpose.id, label: purpose.name };
        expect(getPurposeOption()).toEqual(expected);
      });
    });
  });

  describe('unitOptions', () => {
    function getUnitOptions(units) {
      return getSelected({
        'data.units': keyBy(units, 'id'),
      }).unitOptions;
    }

    test('returns an empty array if state contains no units', () => {
      expect(getUnitOptions([])).toEqual([]);
    });

    test('returns an option object for each unit', () => {
      const units = [
        Unit.build(),
        Unit.build(),
      ];
      expect(getUnitOptions(units)).toHaveLength(units.length);
    });

    describe('a returned option object', () => {
      const unit = Unit.build();
      function getUnitOption() {
        return getUnitOptions([unit])[0];
      }

      test('has unit.id as its value property', () => {
        expect(getUnitOption().value).toBe(unit.id);
      });

      test('has unit.name as its label property', () => {
        expect(getUnitOption().label).toBe(unit.name);
      });

      test('does not contain other properties than value and label', () => {
        const expected = { value: unit.id, label: unit.name };
        expect(getUnitOption()).toEqual(expected);
      });
    });
  });

  test('returns urlSearchFilters', () => {
    expect(getSelected().urlSearchFilters).toBeDefined();
  });
});
