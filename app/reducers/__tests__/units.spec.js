import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {fromJS, Map} from 'immutable';
import {createAction} from 'redux-actions';

import * as types from 'constants/ActionTypes';
import {unitsReducer as reducer} from 'reducers/units';

chai.use(chaiImmutable);

describe('Reducer: unitsReducer', () => {
  describe('initial state', () => {
    it('should be an empty Map', () => {
      const expected = Map();
      expect(reducer(undefined, {})).to.equal(expected);
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
        const initialState = Map();
        const unit = {id: 'u-1', name: 'some unit'};
        const expectedState = fromJS({
          'u-1': {id: 'u-1', name: 'some unit'},
        });
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });

      it('should not remove other units from the state', () => {
        const initialState = fromJS({
          'u-1': {id: 'u-1', name: 'some unit'},
          'u-2': {id: 'u-2', name: 'other unit'},
        });
        const unit = {id: 'u-3', name: 'new unit'};
        const expectedState = fromJS({
          'u-1': {id: 'u-1', name: 'some unit'},
          'u-2': {id: 'u-2', name: 'other unit'},
          'u-3': {id: 'u-3', name: 'new unit'},
        });
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });

      it('should overwrite previous unit with the same id', () => {
        const previousResource = {
          id: 'u-1',
          name: 'old name',
        };
        const unit = {
          id: 'u-1',
          name: 'some unit',
        };
        const initialState = fromJS({'u-1': previousResource});
        const expectedState = fromJS({'u-1': unit});
        const action = fetchResourceSuccess(unit);

        expect(reducer(initialState, action)).to.equal(expectedState);
      });
    });
  });
});
