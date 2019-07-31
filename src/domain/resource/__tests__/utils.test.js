import { getResourcePageLink, getUnitAddress } from '../utils';

describe('domain resource utility function', () => {
  describe('getResourcePageLink', () => {
    const resource = {
      id: 'foo'
    };

    test('should return link with resource as part of url', () => {
      const link = getResourcePageLink(resource);
      expect(link).toContain('/resources/');
    });

    test('should return link with resource id', () => {
      const link = getResourcePageLink(resource);
      expect(link).toContain(resource.id);
    });

    test('should be fine even when resource has no id', () => {
      const link = getResourcePageLink({});
      expect(link).toBeDefined();
    });

    test('can append more query to the link', () => {
      const link = getResourcePageLink(resource, 'foo=bar');
      expect(link).toContain('bar');
    });
  });

  describe('getUnitAddress', () => {
    const unit = {
      street_address: {
        en: 'foo',
        fi: 'bar'
      }
    };
    const mockLocale = 'en';
    test('get street address from unit by locale, contain no address zipcode or municiple if none', () => {
      const address = getUnitAddress(unit, mockLocale);

      expect(address).toEqual(unit.street_address.en);
    });

    test('return empty string even when unit have no data', () => {
      const address = getUnitAddress({}, mockLocale);
      expect(address).toBeDefined();
    });

    test('get street address from unit by locale, ', () => {
      const address = getUnitAddress(unit, mockLocale);

      expect(address).toEqual(unit.street_address.en);
    });
  });
});
