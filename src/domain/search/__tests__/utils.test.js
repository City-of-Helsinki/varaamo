import * as searchUtils from '../utils';
import constants from '../../../../app/constants/AppConstants';

describe('src/domain/search/utils.js', () => {
  const expectedSearch =
    // eslint-disable-next-line max-len
    'municipality=helsinki%2Cvantaa%2Cespoo&search=Foo&purpose=events&availableBetween=2019-07-31T14%3A30%2B03%3A00%2C2019-07-31T23%3A30%2B03%3A00%2C30&date=2019-07-31';
  const expectedFilters = {
    municipality: 'helsinki,vantaa,espoo',
    search: 'Foo',
    purpose: 'events',
    availableBetween: '2019-07-31T14:30+03:00,2019-07-31T23:30+03:00,30',
    date: '2019-07-31',
  };

  test('getFiltersFromUrl', () => {
    const filters = searchUtils.getFiltersFromUrl({
      search: `?${expectedSearch}`,
    });
    expect(filters).toEqual(expectedFilters);
  });

  test('getSearchFromFilters', () => {
    const search = searchUtils.getSearchFromFilters(expectedFilters);
    expect(search).toBe(expectedSearch);
  });

  describe('getUnitOptions', () => {
    test('behave well with common cases', () => {
      const units = [
        { id: 1, name: { fi: 'B' } },
        { id: 2, name: { fi: 'C' } },
        { id: 3, name: { fi: 'A' } },
      ];

      const options = searchUtils.getUnitOptions(units, 'fi');

      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBe(3);
      expect(Object.keys(options[0])).toContainEqual('value');
      expect(Object.keys(options[0])).toContainEqual('label');
      expect(options[0]).toMatchObject({ value: 3 });
      expect(options[1]).toMatchObject({ value: 1 });
      expect(options[2]).toMatchObject({ value: 2 });
    });

    test("returns label in Finnish if current locale doesn't exist", () => {
      const units = [{ id: 1, name: { fi: 'B' } }];
      const [option] = searchUtils.getUnitOptions(units, 'en');

      expect(option.label).toEqual(units[0].name.fi);
    });
  });

  test('getPurposeOptions', () => {
    const purposes = [
      { id: 1, name: { fi: 'B' }, parent: null },
      { id: 2, name: { fi: 'C' }, parent: null },
      { id: 3, name: { fi: 'A' }, parent: 2 },
      { id: 4, name: { fi: 'D' }, parent: null },
    ];

    const options = searchUtils.getPurposeOptions(purposes, 'fi');

    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBe(3);
    expect(Object.keys(options[0])).toContainEqual('value');
    expect(Object.keys(options[0])).toContainEqual('label');
    expect(options[0]).toMatchObject({ value: 1 });
    expect(options[1]).toMatchObject({ value: 2 });
    expect(options[2]).toMatchObject({ value: 4 });
  });

  test('getPeopleCapacityOptions', () => {
    const options = searchUtils.getPeopleCapacityOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(Object.keys(options[0])).toContainEqual('value');
    expect(Object.keys(options[0])).toContainEqual('label');
  });

  test('getClosestPeopleCapacityValue', () => {
    expect(searchUtils.getClosestPeopleCapacityValue(2)).toBe(2);
    expect(searchUtils.getClosestPeopleCapacityValue(10)).toBe(10);
    expect(searchUtils.getClosestPeopleCapacityValue(13)).toBe(10);
    expect(searchUtils.getClosestPeopleCapacityValue(15)).toBe(15);
    expect(searchUtils.getClosestPeopleCapacityValue(24)).toBe(20);
    expect(searchUtils.getClosestPeopleCapacityValue(66)).toBe(60);
    expect(searchUtils.getClosestPeopleCapacityValue(70)).toBe(70);
    expect(searchUtils.getClosestPeopleCapacityValue(100)).toBe(100);
    expect(searchUtils.getClosestPeopleCapacityValue(200)).toBe(100);
  });

  test('getMunicipalityOptions', () => {
    const options = searchUtils.getMunicipalityOptions();

    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBe(constants.DEFAULT_MUNICIPALITY_OPTIONS.length);
    expect(Object.keys(options[0])).toContainEqual('value');
    expect(Object.keys(options[0])).toContainEqual('label');
    expect(options.map((option) => option.label)).toEqual(
      constants.DEFAULT_MUNICIPALITY_OPTIONS
    );
  });

  test('getSearchPageLink', () => {
    expect(searchUtils.getSearchPageLink(expectedFilters)).toBe(
      `/search?${expectedSearch}`
    );
  });
});
