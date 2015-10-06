import { expect } from 'chai';

import _ from 'lodash';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import * as types from 'constants/ActionTypes';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { dataReducer as reducer } from 'reducers/dataReducer';

describe('Reducer: dataReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    it('resources should be an empty object', () => {
      expect(initialState.resources).to.deep.equal({});
    });

    it('units should be an empty object', () => {
      expect(initialState.units).to.deep.equal({});
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCE_SUCCESS', () => {
      const fetchResourceSuccess = createAction(
        types.FETCH_RESOURCE_SUCCESS,
        (resource, unit = Unit.build()) => {
          return {
            entities: {
              resources: {
                [resource.id]: resource,
              },
              units: {
                [unit.id]: unit,
              },
            },
          };
        }
      );

      it('should index the given resource by id and add it to state', () => {
        const resource = Resource.build();

        const initialState = Immutable({
          resources: {},
        });
        const expectedResources = Immutable({ [resource.id]: resource });

        const action = fetchResourceSuccess(resource);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });

      it('should not remove other resources from the state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({
          resources: {
            [resources[0].id]: resources[0],
          },
        });
        const expectedResources = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourceSuccess(resources[1]);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });

      it('should overwrite previous resource with the same id', () => {
        const resources = [
          Resource.build({ id: 'r-1' }),
          Resource.build({ id: 'r-1' }),
        ];

        const initialState = Immutable({
          resources: {
            [resources[0].id]: resources[0],
          },
        });
        const expectedResources = Immutable({
          [resources[1].id]: resources[1],
        });

        const action = fetchResourceSuccess(resources[1]);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });

      it('should index the given unit by id and add it to state', () => {
        const unit = Unit.build();

        const initialState = Immutable({
          units: {},
        });
        const expectedUnits = Immutable({
          [unit.id]: unit,
        });

        const action = fetchResourceSuccess(Resource.build(), unit);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });

      it('should not remove other units from the state', () => {
        const units = [
          Unit.build(),
          Unit.build(),
        ];

        const initialState = Immutable({
          units: {
            [units[0].id]: units[0],
          },
        });
        const expectedUnits = Immutable({
          [units[0].id]: units[0],
          [units[1].id]: units[1],
        });

        const action = fetchResourceSuccess(Resource.build(), units[1]);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });

      it('should overwrite previous unit with the same id', () => {
        const units = [
          Unit.build({ id: 'u-1' }),
          Unit.build({ id: 'u-1' }),
        ];

        const initialState = Immutable({
          units: {
            [units[0].id]: units[0],
          },
        });
        const expectedUnits = Immutable({
          [units[1].id]: units[1],
        });

        const action = fetchResourceSuccess(Resource.build(), units[1]);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const fetchResourcesSuccess = createAction(
        types.FETCH_RESOURCES_SUCCESS,
        (resources) => {
          return {
            entities: {
              resources: _.indexBy(resources, 'id'),
            },
            result: _.pluck(resources, 'id'),
          };
        }
      );

      it('should index the given resources by id and add them to state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({
          resources: {},
        });
        const expectedResources = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess(resources);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });

      it('should not remove previous resources from the state', () => {
        const resources = [
          Resource.build(),
          Resource.build(),
        ];

        const initialState = Immutable({
          resources: {
            [resources[0].id]: resources[0],
          },
        });
        const expectedResources = Immutable({
          [resources[0].id]: resources[0],
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess([resources[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });

      it('should overwrite previous resources with the same id', () => {
        const resources = [
          Resource.build({ id: 'r-1' }),
          Resource.build({ id: 'r-1' }),
        ];

        const initialState = Immutable({
          resources: {
            [resources[0].id]: resources[0],
          },
        });
        const expectedResources = Immutable({
          [resources[1].id]: resources[1],
        });

        const action = fetchResourcesSuccess([resources[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState.resources).to.deep.equal(expectedResources);
      });
    });

    describe('FETCH_UNITS_SUCCESS', () => {
      const fetchUnitsSuccess = createAction(
        types.FETCH_UNITS_SUCCESS,
        (units) => {
          return {
            entities: {
              units: _.indexBy(units, 'id'),
            },
            result: _.pluck(units, 'id'),
          };
        }
      );

      it('should index the given units by id and add them to state', () => {
        const units = [
          Unit.build(),
          Unit.build(),
        ];

        const initialState = Immutable({
          units: {},
        });
        const expectedUnits = Immutable({
          [units[0].id]: units[0],
          [units[1].id]: units[1],
        });

        const action = fetchUnitsSuccess(units);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });

      it('should not remove previous units from the state', () => {
        const units = [
          Unit.build(),
          Unit.build(),
        ];

        const initialState = Immutable({
          units: {
            [units[0].id]: units[0],
          },
        });
        const expectedUnits = Immutable({
          [units[0].id]: units[0],
          [units[1].id]: units[1],
        });

        const action = fetchUnitsSuccess([units[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });

      it('should overwrite previous units with the same id', () => {
        const units = [
          Unit.build({ id: 'u-1' }),
          Unit.build({ id: 'u-1' }),
        ];

        const initialState = Immutable({
          units: {
            [units[0].id]: units[0],
          },
        });
        const expectedUnits = Immutable({
          [units[1].id]: units[1],
        });

        const action = fetchUnitsSuccess([units[1]]);
        const nextState = reducer(initialState, action);

        expect(nextState.units).to.deep.equal(expectedUnits);
      });
    });
  });
});
