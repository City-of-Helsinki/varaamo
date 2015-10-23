import { expect } from 'chai';

import moment from 'moment';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { DATE_FORMAT } from 'constants/AppConstants';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { reservationPageSelectors } from 'selectors/reservationPageSelectors';

describe('Selectors: reservationPageSelectors', () => {
  let resources;
  let unit;
  let state;

  beforeEach(() => {
    unit = Unit.build();

    resources = [
      Resource.build({ unit: unit.id }),
      Resource.build({ unit: 'unfetched-id' }),
    ];

    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        resources: {
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        },
        units: {
          [unit.id]: unit,
        },
      }),
      router: {
        params: {
          id: resources[0].id,
        },
      },
      ui: Immutable({
        reservation: {
          date: '2015-10-10',
        },
      }),
    };
  });

  describe('reservation date', () => {
    it('should return the date if it is selected', () => {
      const selected = reservationPageSelectors(state);
      const expected = state.ui.reservation.date;

      expect(selected.date).to.equal(expected);
    });

    it('should return current date string if date is not selected', () => {
      state.ui.reservation.date = '';
      const selected = reservationPageSelectors(state);
      const expected = moment().format(DATE_FORMAT);

      expect(selected.date).to.equal(expected);
    });
  });

  it('should return the id in router.params.id', () => {
    const selected = reservationPageSelectors(state);
    const expected = state.router.params.id;

    expect(selected.id).to.equal(expected);
  });

  describe('isFetchingResource', () => {
    it('should return true if RESOURCE_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.RESOURCE_GET_REQUEST];
      const selected = reservationPageSelectors(state);

      expect(selected.isFetchingResource).to.equal(true);
    });

    it('should return false if RESOURCE_GET_REQUEST is not in activeRequests', () => {
      const selected = reservationPageSelectors(state);

      expect(selected.isFetchingResource).to.equal(false);
    });
  });

  it('should return the resource corresponding to the router.params.id', () => {
    const selected = reservationPageSelectors(state);
    const resourceId = state.router.params.id;
    const expected = state.data.resources[resourceId];

    expect(selected.resource).to.deep.equal(expected);
  });

  it('should return an empty object as resource if resource with given id is not fetched', () => {
    state.router.params.id = 'unfetched-resource-id';
    const selected = reservationPageSelectors(state);

    expect(selected.resource).to.deep.equal({});
  });

  it('should return the unit corresponding to the resource.unit', () => {
    const selected = reservationPageSelectors(state);
    const expected = unit;

    expect(selected.unit).to.deep.equal(expected);
  });

  it('should return an empty object as the unit if unit with the given id is not fetched', () => {
    state.router.params.id = resources[1].id;
    const selected = reservationPageSelectors(state);

    expect(selected.unit).to.deep.equal({});
  });

  it('should return an empty object as the unit if resource is not fetched', () => {
    state.router.params.id = 'unfetched-id';
    const selected = reservationPageSelectors(state);

    expect(selected.unit).to.deep.equal({});
  });
});
