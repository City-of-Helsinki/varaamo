import { advanceTo, clear } from 'jest-date-mock';
import simple from 'simple-mock';

import * as resourceUtils from '../utils';
import resourceFixture from '../../../common/data/fixtures/resource';

const DATE = '2019-08-15';
const OPENING_HOURS = [
  { date: '2019-07-31', opens: '2019-07-31T08:00:00+03:00', closes: '2019-07-31T20:00:00+03:00' },
  { date: '2019-08-01', opens: '2019-08-01T08:00:00+03:00', closes: '2019-08-01T20:00:00+03:00' },
  { date: '2019-08-02', opens: '2019-08-02T08:00:00+03:00', closes: '2019-08-02T20:00:00+03:00' },
  { date: '2019-08-03', opens: '2019-08-03T10:00:00+03:00', closes: '2019-08-03T17:00:00+03:00' },
  { date: '2019-08-04', opens: '2019-08-04T10:00:00+03:00', closes: '2019-08-04T17:00:00+03:00' },
  { date: '2019-08-05', opens: '2019-08-05T08:00:00+03:00', closes: '2019-08-05T20:00:00+03:00' },
  { date: '2019-08-06', opens: '2019-08-06T08:00:00+03:00', closes: '2019-08-06T20:00:00+03:00' },
  { date: '2019-08-07', opens: '2019-08-07T08:00:00+03:00', closes: '2019-08-07T20:00:00+03:00' },
  { date: '2019-08-08', opens: '2019-08-08T08:00:00+03:00', closes: '2019-08-08T20:00:00+03:00' },
  { date: '2019-08-09', opens: '2019-08-09T08:00:00+03:00', closes: '2019-08-09T20:00:00+03:00' },
  { date: '2019-08-10', opens: '2019-08-10T10:00:00+03:00', closes: '2019-08-10T17:00:00+03:00' },
  { date: '2019-08-11', opens: '2019-08-11T10:00:00+03:00', closes: '2019-08-11T17:00:00+03:00' },
  { date: '2019-08-12', opens: '2019-08-12T08:00:00+03:00', closes: '2019-08-12T20:00:00+03:00' },
  { date: '2019-08-13', opens: '2019-08-13T08:00:00+03:00', closes: '2019-08-13T20:00:00+03:00' },
  { date: '2019-08-14', opens: '2019-08-14T08:00:00+03:00', closes: '2019-08-14T20:00:00+03:00' },
  { date: '2019-08-15', opens: '2019-08-15T08:00:00+03:00', closes: '2019-08-15T20:00:00+03:00' },
  { date: '2019-08-16', opens: '2019-08-16T08:00:00+03:00', closes: '2019-08-16T20:00:00+03:00' },
  { date: '2019-08-17', opens: '2019-08-17T10:00:00+03:00', closes: '2019-08-17T17:00:00+03:00' },
  { date: '2019-08-18', opens: '2019-08-18T10:00:00+03:00', closes: '2019-08-18T17:00:00+03:00' },
  { date: '2019-08-19', opens: '2019-08-19T08:00:00+03:00', closes: '2019-08-19T20:00:00+03:00' },
  { date: '2019-08-20', opens: '2019-08-20T08:00:00+03:00', closes: '2019-08-20T20:00:00+03:00' },
  { date: '2019-08-21', opens: '2019-08-21T08:00:00+03:00', closes: '2019-08-21T20:00:00+03:00' },
  { date: '2019-08-22', opens: '2019-08-22T08:00:00+03:00', closes: '2019-08-22T20:00:00+03:00' },
  { date: '2019-08-23', opens: '2019-08-23T08:00:00+03:00', closes: '2019-08-23T20:00:00+03:00' },
  { date: '2019-08-24', opens: '2019-08-24T10:00:00+03:00', closes: '2019-08-24T17:00:00+03:00' },
  { date: '2019-08-25', opens: '2019-08-25T10:00:00+03:00', closes: '2019-08-25T17:00:00+03:00' },
  { date: '2019-08-26', opens: '2019-08-26T08:00:00+03:00', closes: '2019-08-26T20:00:00+03:00' },
  { date: '2019-08-27', opens: '2019-08-27T08:00:00+03:00', closes: '2019-08-27T20:00:00+03:00' },
  { date: '2019-08-28', opens: '2019-08-28T08:00:00+03:00', closes: '2019-08-28T20:00:00+03:00' },
  { date: '2019-08-29', opens: '2019-08-29T08:00:00+03:00', closes: '2019-08-29T20:00:00+03:00' },
  { date: '2019-08-30', opens: '2019-08-30T08:00:00+03:00', closes: '2019-08-30T20:00:00+03:00' },
  { date: '2019-08-31', opens: '2019-08-31T10:00:00+03:00', closes: '2019-08-31T17:00:00+03:00' },
];

describe('domain resource utility function', () => {
  describe('getResourcePageLink', () => {
    const resource = {
      id: 'foo'
    };

    test('should return link with resource as part of url', () => {
      const link = resourceUtils.getResourcePageLink(resource);
      expect(link).toContain('/resources/');
    });

    test('should return link with resource id', () => {
      const link = resourceUtils.getResourcePageLink(resource);
      expect(link).toContain(resource.id);
    });

    test('should be fine even when resource has no id', () => {
      const link = resourceUtils.getResourcePageLink({});
      expect(link).toBeDefined();
    });

    test('can append more query to the link', () => {
      const link = resourceUtils.getResourcePageLink(resource, 'foo=bar');
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
      const address = resourceUtils.getUnitAddress(unit, mockLocale);

      expect(address).toEqual(unit.street_address.en);
    });

    test('return empty string even when unit have no data', () => {
      const address = resourceUtils.getUnitAddress({}, mockLocale);
      expect(address).toBeDefined();
    });

    test('get street address from unit by locale, ', () => {
      const address = resourceUtils.getUnitAddress(unit, mockLocale);

      expect(address).toEqual(unit.street_address.en);
    });

    test('return address zip if exist', () => {
      const address = resourceUtils.getUnitAddress({ ...unit, address_zip: '1234' });
      expect(address).toContain('1234');
    });

    test('return municipality if exist', () => {
      const address = resourceUtils.getUnitAddress({ ...unit, municipality: 'espoo' });
      expect(address).toContain('espoo');
    });
  });

  describe('getResourceDistance', () => {
    const resource = {
      distance: 2000
    };
    const distance = resourceUtils.getResourceDistance(resource);

    test('return distance to contain km in string', () => {
      expect(distance).toContain('km');
    });

    test('return null string in case no distance', () => {
      const emptyDistance = resourceUtils.getResourceDistance({});
      expect(emptyDistance).toBeDefined();
    });

    test('round result to 1 digit after comma', () => {
      expect(distance).toEqual('2 km');
      const rounded = resourceUtils.getResourceDistance({ distance: 100 });
      expect(rounded).toEqual('0.1 km');
    });
  });

  describe('getPrice', () => {
    const fakeT = foo => foo;
    test('return free text if there is no price', () => {
      const price = resourceUtils.getPrice({}, fakeT);
      expect(price).toContain('free');
    });

    test('return free text if price is 0', () => {
      const price = resourceUtils.getPrice({
        min_price_per_hour: '0'
      }, fakeT);

      expect(price).toContain('free');
    });

    test('return price even if there is 1 price', () => {
      const price = resourceUtils.getPrice({
        min_price_per_hour: '123'
      }, fakeT);

      expect(price).toContain('123');
    });

    test('return price range if both min and max price included', () => {
      const price = resourceUtils.getPrice({
        min_price_per_hour: '123',
        max_price_per_hour: '234'
      }, fakeT);

      expect(price).toEqual('123 - 234 €/h');
    });

    test('return null if price exist but not number', () => {
      const price = resourceUtils.getPrice({
        min_price_per_hour: 'foo'
      });
      expect(price).toBeNull();
    });
  });

  describe('isFree', () => {
    test('return true if there is no price', () => {
      const price = resourceUtils.isFree({});
      expect(price).toBeTruthy();
    });

    test('return true if price is 0', () => {
      const price = resourceUtils.isFree({
        min_price_per_hour: '0'
      });

      expect(price).toBeTruthy();
    });

    test('return false even if there is 1 price', () => {
      const price = resourceUtils.isFree({
        min_price_per_hour: '123'
      });

      expect(price).toBeFalsy();
    });

    test('return false if both min and max price included', () => {
      const price = resourceUtils.isFree({
        min_price_per_hour: '123',
        max_price_per_hour: '234'
      });

      expect(price).toBeFalsy();
    });
  });

  test('getOpeningHours', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const openingHours = resourceUtils.getOpeningHours(resource, DATE);
    expect(openingHours).toEqual({
      closes: '2019-08-15T20:00:00+03:00',
      opens: '2019-08-15T08:00:00+03:00',
    });
  });

  test('getOpeningHoursForWeek', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const openingHours = resourceUtils.getOpeningHoursForWeek(resource, DATE);
    expect(openingHours.length).toBe(7);
    expect(openingHours.map(item => item.date).sort()).toEqual([
      '2019-08-12',
      '2019-08-13',
      '2019-08-14',
      '2019-08-15',
      '2019-08-16',
      '2019-08-17',
      '2019-08-18',
    ].sort());
  });

  test('getFullCalendarBusinessHours', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const businessHours = resourceUtils.getFullCalendarBusinessHours(resource, DATE);
    expect(businessHours).toEqual([
      { daysOfWeek: [1], startTime: '08:00', endTime: '20:00' },
      { daysOfWeek: [2], startTime: '08:00', endTime: '20:00' },
      { daysOfWeek: [3], startTime: '08:00', endTime: '20:00' },
      { daysOfWeek: [4], startTime: '08:00', endTime: '20:00' },
      { daysOfWeek: [5], startTime: '08:00', endTime: '20:00' },
      { daysOfWeek: [6], startTime: '10:00', endTime: '17:00' },
      { daysOfWeek: [0], startTime: '10:00', endTime: '17:00' }
    ]);
  });

  test('getFullCalendarMinTime', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const minTimeDay = resourceUtils.getFullCalendarMinTime(resource, DATE, 'timeGridDay', 3);
    expect(minTimeDay).toBe('05:00:00');

    const minTimeWeek = resourceUtils.getFullCalendarMinTime(resource, DATE, 'timeGridWeek', 2);
    expect(minTimeWeek).toBe('06:00:00');
  });

  test('getFullCalendarMaxTime', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const minTimeDay = resourceUtils.getFullCalendarMaxTime(resource, DATE, 'timeGridDay', 3);
    expect(minTimeDay).toBe('23:00:00');

    const minTimeWeek = resourceUtils.getFullCalendarMaxTime(resource, DATE, 'timeGridWeek', 2);
    expect(minTimeWeek).toBe('22:00:00');
  });

  test('getFullCalendarBusinessHoursForDate', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
    });

    const businessHours = resourceUtils.getFullCalendarBusinessHoursForDate(resource, DATE);
    expect(businessHours).toEqual({ daysOfWeek: [4], startTime: '08:00', endTime: '20:00' });
  });

  test('getFullCalendarSlotLabelInterval', () => {
    const interval15min = resourceUtils
      .getFullCalendarSlotLabelInterval(resourceFixture.build({ slot_size: '00:15:00' }));
    const interval30min = resourceUtils
      .getFullCalendarSlotLabelInterval(resourceFixture.build({ slot_size: '00:30:00' }));
    const interval1h = resourceUtils
      .getFullCalendarSlotLabelInterval(resourceFixture.build({ slot_size: '01:00:00' }));
    const interval3h = resourceUtils
      .getFullCalendarSlotLabelInterval(resourceFixture.build({ slot_size: '03:00:00' }));

    expect(interval15min).toBe('00:30:00');
    expect(interval30min).toBe('01:00:00');
    expect(interval1h).toBe('01:00:00');
    expect(interval3h).toBe('01:00:00');
  });

  test('getFullCalendarSlotDuration', () => {
    const resource = resourceFixture.build({
      opening_hours: OPENING_HOURS,
      slot_size: '00:30:00',
    });

    const slotDuration = resourceUtils.getFullCalendarSlotDuration(resource, DATE, 'timeGridWeek');
    expect(slotDuration).toBe('00:30:00');
  });

  test('isDateReservable', () => {
    const resourceReservable = resourceFixture.build({
      reservable_after: '2019-08-10T00:00:00Z',
      reservable_before: '2019-09-21T00:00:00Z',
      user_permissions: {
        is_admin: false,
      },
    });

    const resourceNotReservable = resourceFixture.build({
      reservable_after: '2019-08-16T00:00:00Z',
      reservable_before: '2019-09-21T00:00:00Z',
      user_permissions: {
        is_admin: false,
      },
    });

    const resourceAdmin = resourceFixture.build({
      reservable_after: '2019-08-16T00:00:00Z',
      reservable_before: '2019-09-21T00:00:00Z',
      user_permissions: {
        is_admin: true,
      },
    });

    expect(resourceUtils.isDateReservable(resourceReservable, DATE)).toBe(true);
    expect(resourceUtils.isDateReservable(resourceNotReservable, DATE)).toBe(false);
    expect(resourceUtils.isDateReservable(resourceAdmin, DATE)).toBe(true);
  });

  test('isTimeRangeReservable', () => {
    const resource = resourceFixture.build({
      reservable_after: '2019-08-10T00:00:00Z',
      reservable_before: '2019-09-21T00:00:00Z',
      opening_hours: OPENING_HOURS,
      user_permissions: {
        is_admin: false,
      },
    });

    advanceTo(new Date(2019, 7, 15, 8, 0, 0));

    expect(resourceUtils.isTimeRangeReservable(resource, `${DATE}T08:00:00Z`, `${DATE}T10:00:00Z`))
      .toBe(true);

    expect(resourceUtils.isTimeRangeReservable(resource, `${DATE}T08:00:00Z`, `${DATE}T16:00:00Z`, true))
      .toBe(true);

    clear();
    Date.now();
  });

  test('getSlotSizeInMinutes', () => {
    const resource = resourceFixture.build({
      slot_size: '01:30:00',
    });

    expect(resourceUtils.getSlotSizeInMinutes(resource)).toBe(90);
  });

  describe('getReservationPrice', () => {
    test('return the correct price when the period is one hour', () => {
      const resource = resourceFixture.build({
        products: [{
          price: { amount: 20, type: 'per_period', period: '01:00:00' }

        }],
      });

      const price = resourceUtils.getReservationPrice(`${DATE}T08:00:00Z`, `${DATE}T10:00:00Z`, resource);
      expect(price).toBe(40);
    });

    test('return the correct price when the supplied period is more than an hour', () => {
      const resource = resourceFixture.build({
        products: [{
          price: { amount: 20, type: 'per_period', period: '02:00:00' }

        }],
      });

      const price = resourceUtils.getReservationPrice(`${DATE}T08:00:00Z`, `${DATE}T10:00:00Z`, resource);
      expect(price).toBe(20);
    });

    test('return the correct price when the supplied period is less than an hour', () => {
      const resource = resourceFixture.build({
        products: [{
          price: { amount: 20, type: 'per_period', period: '00:30:00' }

        }],
      });

      const price = resourceUtils.getReservationPrice(`${DATE}T08:00:00Z`, `${DATE}T10:00:00Z`, resource);
      expect(price).toBe(80);
    });

    test('return 0 if the supplied period is 0', () => {
      const resource = resourceFixture.build({
        products: [{
          price: { amount: 20, type: 'per_period', period: '00:00:00' }

        }],
      });

      const price = resourceUtils.getReservationPrice(`${DATE}T08:00:00Z`, `${DATE}T10:00:00Z`, resource);
      expect(price).toBe(0);
    });
  });
  describe('getMaxPeriodText', () => {
    test('returns max period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { maxPeriod: '24:00:00' };
      const result = resourceUtils.getMaxPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.maxPeriodDays');
      expect(t.lastCall.args[1]).toEqual({ days: 1 });
      expect(result).toBe('days');
    });

    test('returns max period as hours', () => {
      const t = simple.stub().returnWith('hours');
      const resource = { maxPeriod: '02:00:00' };
      const result = resourceUtils.getMaxPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.maxPeriodHours');
      expect(t.lastCall.args[1]).toEqual({ hours: 2 });
      expect(result).toBe('hours');
    });
  });

  describe('getMinPeriodText', () => {
    test('returns min period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { minPeriod: '24:00:00' };
      const result = resourceUtils.getMinPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.minPeriodDays');
      expect(t.lastCall.args[1]).toEqual({ days: 1 });
      expect(result).toBe('days');
    });

    test('returns min period as hours', () => {
      const t = simple.stub().returnWith('hours');
      const resource = { minPeriod: '02:00:00' };
      const result = resourceUtils.getMinPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.minPeriodHours');
      expect(t.lastCall.args[1]).toEqual({ hours: 2 });
      expect(result).toBe('hours');
    });
  });
});
