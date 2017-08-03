import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { toggleResourceMap } from 'actions/uiActions';
import types from 'constants/ActionTypes';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import resourceMapReducer from './resourceMapReducer';

describe('state/reducers/ui/resourceMapReducer', () => {
  describe('initial state', () => {
    const initialState = resourceMapReducer(undefined, {});

    it('resourceId is null', () => {
      expect(initialState.resourceId).to.be.null;
    });

    it('showMap is false', () => {
      expect(initialState.showMap).to.equal(false);
    });

    it('unitId is null', () => {
      expect(initialState.unitId).to.equal(null);
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


      it('sets the unitId if given resource id is the same than state resourceId', () => {
        const action = searchResourcesSuccess({ resources, units });
        const initialState = Immutable({
          resourceId: resources[0].id,
          unitId: null,
        });
        const expected = units[0].id;
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.unitId).to.deep.equal(expected);
      });

      it('does not set the unitId if given resource id is not the same than state resourceId', () => {
        const action = searchResourcesSuccess({ resources, units });
        const initialState = Immutable({
          resourceId: 'qwertyqwerty',
          unitId: null,
        });
        const expected = null;
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.unitId).to.deep.equal(expected);
      });
    });

    describe('UI.TOGGLE_SEARCH_SHOW_MAP', () => {
      it('toggles showMap if false', () => {
        const action = toggleResourceMap();
        const initialState = Immutable({
          showMap: false,
        });
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.showMap).to.be.true;
      });

      it('toggles showMap if true', () => {
        const action = toggleResourceMap();
        const initialState = Immutable({
          showMap: true,
        });
        const nextState = resourceMapReducer(initialState, action);

        expect(nextState.showMap).to.be.false;
      });
    });

    describe('ENTER_OR_CHANGE_RESOURCE_PAGE', () => {
      it('Sets resourceId from location pathname', () => {
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

        expect(nextState.resourceId).to.equal('qwertyasdfgh');
      });
    });
  });
});
