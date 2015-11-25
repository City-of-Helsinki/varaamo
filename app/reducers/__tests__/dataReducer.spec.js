import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { logout } from 'actions/authActions';
import types from 'constants/ActionTypes';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import User from 'fixtures/User';
import dataReducer, { handleData } from 'reducers/dataReducer';

describe('Reducer: dataReducer', () => {
  describe('initial state', () => {
    const initialState = dataReducer(undefined, {});

    it('reservations should be an empty object', () => {
      expect(initialState.reservations).to.deep.equal({});
    });

    it('resources should be an empty object', () => {
      expect(initialState.resources).to.deep.equal({});
    });

    it('units should be an empty object', () => {
      expect(initialState.units).to.deep.equal({});
    });

    it('users should be an empty object', () => {
      expect(initialState.users).to.deep.equal({});
    });
  });

  describe('handling data', () => {
    const data = {
      resources: {
        'r-1': { value: 'some-value' },
      },
    };

    it('should add the given entities to state', () => {
      const initialState = Immutable({
        resources: {},
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should not remove other entities in the same data collection', () => {
      const initialState = Immutable({
        resources: {
          'r-2': { value: 'other-value' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
          'r-2': { value: 'other-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should override values with the same id in the same data collection', () => {
      const initialState = Immutable({
        resources: {
          'r-1': { value: 'override this' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('should not change the other data collections', () => {
      const initialState = Immutable({
        resources: {},
        units: {
          'u-1': { value: 'unit-value' },
        },
      });
      const expectedState = Immutable({
        resources: {
          'r-1': { value: 'some-value' },
        },
        units: {
          'u-1': { value: 'unit-value' },
        },
      });
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
      expect(nextState.units).to.equal(initialState.units);
    });
  });

  describe('handling actions', () => {
    describe('API.LOGOUT', () => {
      it('should remove the user with the given id', () => {
        const user = User.build();
        const initialState = Immutable({
          users: { [user.id]: user },
        });
        const action = logout(user.id);
        const nextState = dataReducer(initialState, action);

        expect(nextState.users).to.deep.equal({});
      });

      it('should not affect other users', () => {
        const users = [
          User.build(),
          User.build(),
        ];
        const initialState = Immutable({
          users: _.indexBy(users, 'id'),
        });
        const action = logout(users[0].id);
        const nextState = dataReducer(initialState, action);
        const expectedUsers = { [users[1].id]: users[1] };

        expect(nextState.users).to.deep.equal(expectedUsers);
      });
    });

    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      it('should add the reservation to reservations', () => {
        const reservation = Reservation.build();
        const initialState = Immutable({
          reservations: {},
          resources: {},
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actualReservations = nextState.reservations;
        const expectedReservations = Immutable({
          [reservation.url]: reservation,
        });

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should add the given reservation to correct resource', () => {
        const resource = Resource.build();
        const reservation = Reservation.build({ resource: resource.id });
        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;
        const expectedReservations = Immutable([reservation]);

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should not touch other resource values', () => {
        const resource = Resource.build({
          otherValue: 'whatever',
        });
        const reservation = Reservation.build({ resource: resource.id });
        const initialState = Immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const putReservationSuccess = createAction(types.API.RESERVATION_PUT_SUCCESS);

      describe('updating reservations', () => {
        it('should add the reservation to reservations if it is not already there', () => {
          const reservation = Reservation.build();
          const initialState = Immutable({
            reservations: {},
            resources: {},
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = Immutable({
            [reservation.url]: reservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should update a reservation already in reservations', () => {
          const oldReservation = Reservation.build({
            begin: 'old-begin',
            end: 'old-end',
          });
          const initialState = Immutable({
            reservations: { [oldReservation.url]: oldReservation },
            resources: {},
          });
          const updatedReservation = Reservation.build({
            begin: 'new-begin',
            'end': 'new-end',
            url: oldReservation.url,
          });
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = Immutable({
            [updatedReservation.url]: updatedReservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });
      });

      describe('updating resource reservations', () => {
        it('should add the given reservation to correct resource', () => {
          const resource = Resource.build();
          const reservation = Reservation.build({ resource: resource.id });
          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = Immutable([reservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should update a reservation already in resource reservations', () => {
          const resource = Resource.build();
          const oldReservation = Reservation.build({
            begin: 'old-begin',
            end: 'old-end',
            resource: resource.id,
          });
          resource.reservations = [oldReservation];

          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const updatedReservation = Reservation.build({
            begin: 'new-begin',
            'end': 'new-end',
            resource: resource.id,
            url: oldReservation.url,
          });
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = Immutable([updatedReservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('should not touch other resource values', () => {
          const resource = Resource.build({
            otherValue: 'whatever',
          });
          const reservation = Reservation.build({ resource: resource.id });
          const initialState = Immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const expectedValue = resource.otherValue;
          const actualvalue = nextState.resources[resource.id].otherValue;

          expect(expectedValue).to.deep.equal(actualvalue);
        });
      });
    });

    describe('API.RESERVATION_DELETE_SUCCESS', () => {
      const deleteReservationSuccess = createAction(types.API.RESERVATION_DELETE_SUCCESS);
      const reservations = [
        Reservation.build(),
        Reservation.build(),
      ];

      it('should remove the given reservation from reservations', () => {
        const initialState = Immutable({
          reservations: { [reservations[0].url]: reservations[0] },
          resources: {},
        });
        const action = deleteReservationSuccess(reservations[0]);
        const nextState = dataReducer(initialState, action);
        const expectedReservations = {};

        expect(nextState.reservations).to.deep.equal(expectedReservations);
      });

      it('should not remove other reservations', () => {
        const initialState = Immutable({
          reservations: _.indexBy(reservations, 'url'),
          resources: {},
        });
        const action = deleteReservationSuccess(reservations[0]);
        const nextState = dataReducer(initialState, action);
        const expectedReservations = Immutable({
          [reservations[1].url]: reservations[1],
        });

        expect(nextState.reservations).to.deep.equal(expectedReservations);
      });

      it('should remove the given reservation from resource.reservations', () => {
        const resource = Resource.build({ reservations: [reservations[0]] });
        reservations[0].resource = resource.id;
        const initialState = Immutable({
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservations[0]);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;
        const expectedReservations = [];

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should not remove other resource.reservations', () => {
        const resource = Resource.build({ reservations: reservations });
        reservations[0].resource = resource.id;
        reservations[1].resource = resource.id;
        const initialState = Immutable({
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservations[0]);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;
        const expectedReservations = Immutable([reservations[1]]);

        expect(actualReservations).to.deep.equal(expectedReservations);
      });
    });
  });
});
