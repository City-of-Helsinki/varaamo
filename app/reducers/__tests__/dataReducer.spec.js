import { expect } from 'chai';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import { dataReducer as reducer, handleData } from 'reducers/dataReducer';

describe('Reducer: dataReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    it('resources should be an empty object', () => {
      expect(initialState.resources).to.deep.equal({});
    });

    it('units should be an empty object', () => {
      expect(initialState.units).to.deep.equal({});
    });

    it('users should contain mock user data', () => {
      const expected = Immutable({
        'u-1': {
          id: 'u-1',
          name: 'Luke Skywalker',
        },
      });

      expect(initialState.users).to.deep.equal(expected);
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
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const makeReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);
      const reservations = [
        {
          begin: 'old-begin',
          end: 'new-begin',
        },
      ];
      const resource = Resource.build({
        reservations,
        otherValue: 'whatever',
      });
      const reservation = {
        begind: 'some-begin',
        end: 'some-end',
        resource: resource.id,
      };
      const initialState = Immutable({
        resources: { [resource.id]: resource },
      });
      const action = makeReservationSuccess(reservation);
      const nextState = reducer(initialState, action);

      it('should add the given reservation to correct resource', () => {
        const expectedReservations = Immutable([
          reservations[0],
          reservation,
        ]);
        const actualReservations = nextState.resources[resource.id].reservations;

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('should not touch other resource values', () => {
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });
  });
});
