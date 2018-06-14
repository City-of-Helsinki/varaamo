import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import User from 'utils/fixtures/User';
import reservationPageSelector from './reservationPageSelector';

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
        selected: [{
          begin: '2016-10-10T10:00:00+03:00',
          end: '2016-10-10T11:00:00+03:00',
          resource: defaultResource.id,
        }],
        toEdit: [defaultReservation],
        toShow: [defaultReservation],
        toShowEdited: [defaultReservation],
      },
    }),
  };
}

function getProps(id = 'some-id') {
  return {
    location: {
      query: {
        date: '2015-10-10',
        resource: defaultResource.id,
      },
    },
    params: {
      id,
    },
  };
}

describe('pages/reservation/reservationPageSelector', () => {
  it('returns date', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.date).to.exist;
  });

  it('returns isAdmin', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isAdmin).to.exist;
  });

  it('returns isStaff', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isStaff).to.exist;
  });

  it('returns isFetchingResource', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isFetchingResource).to.exist;
  });

  it('returns isMakingReservations', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.isMakingReservations).to.exist;
  });

  it('returns resource', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.resource).to.exist;
  });

  it('returns resourceId', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.resourceId).to.exist;
  });

  it('returns reservationToEdit', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationToEdit).to.exist;
  });

  it('returns reservationCreated', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationCreated).to.exist;
  });

  it('returns reservationEdited', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.reservationEdited).to.exist;
  });

  it('returns the unit corresponding to the resource.unit', () => {
    const state = getState([defaultResource], [defaultUnit]);
    const props = getProps(defaultResource.id);
    const selected = reservationPageSelector(state, props);

    expect(selected.unit).to.deep.equal(defaultUnit);
  });

  it('returns user', () => {
    const state = getState();
    const props = getProps();
    const selected = reservationPageSelector(state, props);

    expect(selected.user).to.exist;
  });
});
