import types from 'constants/ActionTypes';

import keyBy from 'lodash/keyBy';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { toggleResourceMap } from 'actions/uiActions';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import resourceMapReducer from './resourceMapReducer';

describe('state/reducers/ui/resourceMapReducer', () => {
  describe('initial state', () => {
    const initialState = resourceMapReducer(undefined, {});

    test('resourceId is null', () => {
      expect(initialState.resourceId).toBeNull();
    });

    test('showMap is false', () => {
      expect(initialState.showMap).toBe(false);
    });

    test('unitId is null', () => {
      expect(initialState.unitId).toBeNull();
    });
  });

  describe('handling actions', () => {
    describe('API.RESOURCE_GET_SUCCESS', () => {
      const searchResourcesSuccess = createAction(
        types.API.RESOURCE_GET_SUCCESS,
        ({ resources = [], units = [] }) => ({
          entities: {
            resources: keyBy(resources, 'id'),
            units: keyBy(units, 'id'),
          },
        })
      );
      const units = [
        Unit.build(),
      ];
      const resources = [
        Resource.build({ unit: units[0].id }),
      ];


      test(
        'sets the unitId if given resource id is the same than state resourceId',
        () => {
          const action = searchResourcesSuccess({ resources, units });
          const initialState = Immutable({
            resourceId: resources[0].id,
            unitId: null,
          });
          const expected = units[0].id;
          const nextState = resourceMapReducer(initialState, action);

          expect(nextState.unitId).toEqual(expected);
        }
      );

      test(
        'does not set the unitId if given resource id is not the same than state resourceId',
        () => {
          const action = searchResourcesSuccess({ resources, units });
          const initialState = Immutable({
            resourceId: 'qwertyqwerty',
            unitId: null,
          });
          const expected = null;
          const nextState = resourceMapReducer(initialState, action);

          expect(nextState.unitId).toEqual(expected);
        }
      );
    });

    describe('UI.TOGGLE_SEARCH_SHOW_MAP', () => {
      test('toggles showMap if false', () => {
        const action = toggleResourceMap();
        const initialState = Immutable({
          showMap: false,
        });
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.showMap).toBe(true);
      });

      test('toggles showMap if true', () => {
        const action = toggleResourceMap();
        const initialState = Immutable({
          showMap: true,
        });
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.showMap).toBe(false);
      });
    });

    describe('ENTER_OR_CHANGE_RESOURCE_PAGE', () => {
      test('Sets resourceId from location pathname', () => {
        const resourcePageChange = createAction(
          'ENTER_OR_CHANGE_RESOURCE_PAGE',
          location => (location)
        );
        const action = resourcePageChange({
          pathname: '/resources/qwertyasdfgh',
        });
        const initialState = Immutable({
          resourceId: null,
        });
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.resourceId).toBe('qwertyasdfgh');
      });
    });
  });
});
