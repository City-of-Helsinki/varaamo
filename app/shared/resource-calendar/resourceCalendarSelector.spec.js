import { expect } from 'chai';
import Immutable from 'seamless-immutable';
import Resource, { openingHoursMonth } from 'utils/fixtures/Resource';

import resourceCalendarSelector from './resourceCalendarSelector';

function getState(resource) {
  return {
    data: Immutable({
      resources: { [resource.id]: resource },
    }),
  };
}

function getProps(id = 'some-id') {
  return {
    resourceId: id,
  };
}

describe('shared/resource-calendar/resourceCalendarSelector', () => {
  let availability;
  const resource = Resource.build({
    availableHours: [
      // Day 2015-10-01 is completely available
      {
        starts: '2015-10-01T10:00:00+03:00',
        ends: '2015-10-01T15:00:00+03:00',
      },
      {
        starts: '2015-10-01T16:00:00+03:00',
        ends: '2015-10-01T20:00:00+03:00',
      },
      // Day 2015-10-10 is partially available
      {
        starts: '2015-10-10T12:00:00+03:00',
        ends: '2015-10-10T15:00:00+03:00',
      },
      // Day 2015-10-11 is fully booked
      {
        starts: '2015-10-11T20:00:00+03:00',
        ends: '2015-10-11T20:00:00+03:00',
      },
    ],
    minPeriod: '01:00:00',
    openingHours: openingHoursMonth,
    reservations: [
      // Day 2015-10-10 is partially available
      {
        begin: '2015-10-10T15:00:00+03:00',
        end: '2015-10-10T18:00:00+03:00',
        state: 'confirmed',
      },
      // Day 2015-10-11 is fully booked
      {
        begin: '2015-10-11T10:00:00+03:00',
        end: '2015-10-11T20:00:00+03:00',
        state: 'confirmed',
      },
      // Day 2015-10-30 is available with canceled reservation
      {
        begin: '2015-10-30T19:00:00+03:00',
        end: '2015-10-30T20:00:00+03:00',
        state: 'cancelled',
      },
      // Day 2015-10-31 is available with denied reservation
      {
        begin: '2015-10-31T19:00:00+03:00',
        end: '2015-10-31T20:00:00+03:00',
        state: 'denied',
      },
    ],
  });

  before(() => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = resourceCalendarSelector(state, props);
    availability = selected.availability;
  });

  it('calculates correct percentages for completely available', () => {
    expect(availability['2015-10-01'].percentage).to.equal(100);
  });

  it('calculates correct percentages for partially available', () => {
    expect(availability['2015-10-10'].percentage).to.equal(50);
  });

  it('calculates correct percentages for fully booked', () => {
    expect(availability['2015-10-11'].percentage).to.equal(0);
  });

  it('calculates correct percentages if reservation is cancelled', () => {
    expect(availability['2015-10-30'].percentage).to.equal(100);
  });

  it('calculates correct percentages if reservation is cancelled', () => {
    expect(availability['2015-10-31'].percentage).to.equal(100);
  });
});
