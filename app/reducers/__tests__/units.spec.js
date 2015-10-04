import { expect } from 'chai';

import Immutable from 'seamless-immutable';
import { createAction } from 'redux-actions';

import * as types from 'constants/ActionTypes';
import Unit from 'fixtures/Unit';
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
        const unit = Unit.build();

        const initialState = Immutable({});
        const expectedState = Immutable({
          [unit.id]: unit,
        });

        const action = fetchResourceSuccess(unit);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should not remove other units from the state', () => {
        const units = [
          Unit.build(),
          Unit.build(),
        ];

        const initialState = Immutable({
          [units[0].id]: units[0],
        });
        const expectedState = Immutable({
          [units[0].id]: units[0],
          [units[1].id]: units[1],
        });

        const action = fetchResourceSuccess(units[1]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });

      it('should overwrite previous unit with the same id', () => {
        const units = [
          Unit.build({ id: 'u-1' }),
          Unit.build({ id: 'u-1' }),
        ];

        const initialState = Immutable({
          [units[0].id]: units[0],
        });
        const expectedState = Immutable({
          [units[1].id]: units[1],
        });

        const action = fetchResourceSuccess(units[1]);
        const nextState = reducer(initialState, action);

        expect(nextState).to.deep.equal(expectedState);
      });
    });
  });
});
