import {
  getResourcePageLink, getUnitAddress, getResourceDistance, getPrice, isFree
} from '../utils';

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
      },
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

    test('return address zip if exist', () => {
      const address = getUnitAddress({ ...unit, address_zip: '1234' });
      expect(address).toContain('1234');
    });

    test('return municipality if exist', () => {
      const address = getUnitAddress({ ...unit, municipality: 'espoo' });
      expect(address).toContain('espoo');
    });
  });

  describe('getResourceDistance', () => {
    const resource = {
      distance: 2000
    };
    const distance = getResourceDistance(resource);

    test('return distance to contain km in string', () => {
      expect(distance).toContain('km');
    });

    test('return null string in case no distance', () => {
      const emptyDistance = getResourceDistance({});
      expect(emptyDistance).toBeDefined();
    });

    test('round result to 1 digit after comma', () => {
      expect(distance).toEqual('2 km');
      const rounded = getResourceDistance({ distance: 100 });
      expect(rounded).toEqual('0.1 km');
    });
  });

  describe('getPrice', () => {
    const fakeT = foo => foo;
    test('return free text if there is no price', () => {
      const price = getPrice({}, fakeT);
      expect(price).toContain('free');
    });

    test('return free text if price is 0', () => {
      const price = getPrice({
        min_price_per_hour: '0'
      }, fakeT);

      expect(price).toContain('free');
    });

    test('return price even if there is 1 price', () => {
      const price = getPrice({
        min_price_per_hour: '123'
      }, fakeT);

      expect(price).toContain('123');
    });

    test('return price range if both min and max price included', () => {
      const price = getPrice({
        min_price_per_hour: '123',
        max_price_per_hour: '234'
      }, fakeT);

      expect(price).toEqual('123 - 234 €/h');
    });

    test('return null if price exist but not number', () => {
      const price = getPrice({
        min_price_per_hour: 'foo'
      });
      expect(price).toBeNull();
    });
  });

  describe('isFree', () => {
    test('return true if there is no price', () => {
      const price = isFree({});
      expect(price).toBeTruthy();
    });

    test('return true if price is 0', () => {
      const price = isFree({
        min_price_per_hour: '0'
      });

      expect(price).toBeTruthy();
    });

    test('return false even if there is 1 price', () => {
      const price = isFree({
        min_price_per_hour: '123'
      });

      expect(price).toBeFalsy();
    });

    test('return false if both min and max price included', () => {
      const price = isFree({
        min_price_per_hour: '123',
        max_price_per_hour: '234'
      });

      expect(price).toBeFalsy();
    });
  });
});
