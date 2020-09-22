import { getCancelCategories } from '../utils';

const fixture = [
  {
    description: null,
    id: 1,
    name: { fi: 'Muut', en: 'Other', sv: 'Övrig' },
    reservation_type: 'confirmed',
  },
  {
    description: null,
    id: 2,
    name: { fi: 'Testi', en: 'Test' },
    reservation_type: 'own',
  },
  {
    description: null,
    id: 3,
    name: { fi: 'Hylätty', en: 'Rejected' },
    reservation_type: 'requested',
  },
];

describe('utils', () => {
  describe('getCancelCategories', () => {
    test('should return an empty array if "data" is undefined', () => {
      expect(getCancelCategories(undefined, false, 'fi')).toEqual([]);
    });

    test('should return an array of objects', () => {
      expect(getCancelCategories(fixture, true, 'fi')).toMatchSnapshot();
    });

    test('should allow only "own" category type fo non-admin users', () => {
      const isAdmin = false;
      expect(getCancelCategories(fixture, isAdmin, 'fi')).toHaveLength(1);
      expect(getCancelCategories(fixture, isAdmin, 'fi')).toHaveProperty([0, 'value'], fixture[1].id);
    });
  });
});
