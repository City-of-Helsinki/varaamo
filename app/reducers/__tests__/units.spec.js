import { expect } from 'chai';

import Immutable from 'seamless-immutable';
import { createAction } from 'redux-actions';

import * as types from 'constants/ActionTypes';
import { unitsReducer as reducer } from 'reducers/units';

describe('Reducer: unitsReducer', () => {
  describe('initial state', () => {
    it('should be an empty object', () => {
      const initialState = reducer(undefined, {});
      expect(initialState).to.deep.equal({});
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCE_SUCCESS', () => {
      const fetchResourceSuccess = createAction(
        types.FETCH_RESOURCE_SUCCESS,
        (unit) => {
          return {
            entities: {
              units: {
                [unit.id]: unit,
              },
            },
          };
        }
      );

      it('should index the given unit by id and add it to state', () => {
        const initialState = Immutable({});
        const unit = { id: 'u-1', name: 'some unit' };
        const expectedState = Immutable({
          'u-1': { id: 'u-1', name: 'some unit' },
        });
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should not remove other units from the state', () => {
        const initialState = Immutable({
          'u-1': { id: 'u-1', name: 'some unit' },
          'u-2': { id: 'u-2', name: 'other unit' },
        });
        const unit = { id: 'u-3', name: 'new unit' };
        const expectedState = Immutable({
          'u-1': { id: 'u-1', name: 'some unit' },
          'u-2': { id: 'u-2', name: 'other unit' },
          'u-3': { id: 'u-3', name: 'new unit' },
        });
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });

      it('should overwrite previous unit with the same id', () => {
        const previousUnit = {
          id: 'u-1',
          name: 'old name',
        };
        const unit = {
          id: 'u-1',
          name: 'some unit',
        };
        const initialState = Immutable({ 'u-1': previousUnit });
        const expectedState = Immutable({ 'u-1': unit });
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.deep.equal(expectedState);
      });
    });
  });
});
