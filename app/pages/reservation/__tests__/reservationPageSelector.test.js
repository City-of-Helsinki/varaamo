import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import Unit from '../../../utils/fixtures/Unit';
import User from '../../../utils/fixtures/User';
import reservationPageSelector from '../reservationPageSelector';

const defaultUnit = Unit.build();
const defaultReservation = Reservation.build();
const defaultResource = Resource.build({ unit: defaultUnit.id });
const defaultUser = User.build();

function getState(resources = [], units = [], user = defaultUser) {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    auth: Immutable({
      userId: user.id,
      token: 'mock-token',
    }),
    data: Immutable({
      resources: keyBy(resources, 'id'),
      units: keyBy(units, 'id'),
      users: { [user.id]: user },
    }),
    ui: Immutable({
      reservations: {
        selected: [
          {
            begin: '2016-10-10T10:00:00+03:00',
            end: '2016-10-10T11:00:00+03:00',
            resource: defaultResource.id,
          },
        ],
        toEdit: [defaultReservation],
        toShow: [defaultReservation],
        toShowEdited: [defaultReservation],
      },
    }),
    recurringReservations: [],
  };
}

function getProps(id = 'some-id') {
  return {
    location: {
      search: `?date=2015-10-10&resource=${defaultResource.id}`,
    },
    params: {
      id,
    },
  };
}

describe('pages/reservation/reservationPageSelector', () => {
  test('returns date', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.date).toBeDefined();
  });

  test('returns isAdmin', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isAdmin).toBeDefined();
  });

  test('returns isStaff', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isStaff).toBeDefined();
  });

  test('returns isFetchingResource', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isFetchingResource).toBeDefined();
  });

  test('returns isMakingReservations', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isMakingReservations).toBeDefined();
  });

  test('returns resource', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.resource).toBeDefined();
  });

  test('returns resourceId', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.resourceId).toBeDefined();
  });

  test('returns reservationToEdit', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationToEdit).toBeDefined();
  });

  test('returns reservationCreated', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationCreated).toBeDefined();
  });

  test('returns reservationEdited', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationEdited).toBeDefined();
  });

  test('returns the unit corresponding to the resource.unit', () => {
    const state = getState([defaultResource], [defaultUnit]);
    const props = getProps(defaultResource.id);
    const selected = reservationPageSelector(state, props);

    expect(selected.unit).toEqual(defaultUnit);
  });

  test('returns user', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.user).toBeDefined();
  });
});
