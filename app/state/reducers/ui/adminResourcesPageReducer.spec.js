import { expect } from 'chai';
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  changeAdminResourcesPageDate,
  selectAdminResourceType,
  unselectAdminResourceType,
} from 'actions/uiActions';
import types from 'constants/ActionTypes';
import Resource from 'utils/fixtures/Resource';
import adminResourcesPageReducer from './adminResourcesPageReducer';

describe('state/reducers/ui/adminResourcesPageReducer', () => {
  describe('initial state', () => {
    const initialState = adminResourcesPageReducer(undefined, {});

    it('resourceIds is an empty array', () => {
      expect(initialState.resourceIds).to.deep.equal([]);
    });

    it('date is undefined', () => {
      expect(initialState.date).to.be.undefined;
    });
  });

  describe('handling actions', () => {
    describe('UI.CHANGE_ADMIN_RESOURCES_PAGE_DATE', () => {
      it('updates date from payload', () => {
        const date = '2017-01-20';
        const state = adminResourcesPageReducer(undefined, changeAdminResourcesPageDate(date));
        expect(state.date).to.equal(date);
      });

      it('sets date to undefined if set to null', () => {
        const state = adminResourcesPageReducer(undefined, changeAdminResourcesPageDate(null));
        expect(state.date).to.be.undefined;
      });
    });

    describe('UI.FILTER_ADMIN_RESOURCE_TYPE', () => {
      it('updates filtered types from payload', () => {
        const resourceType = 'new type';
        const state = adminResourcesPageReducer(undefined, selectAdminResourceType(resourceType));
        expect(state.selectedResourceTypes).to.deep.equal([resourceType]);
      });

      it('does not duplicate types in array', () => {
        const resourceType = 'new type';
        const initialState = Immutable({
          selectedResourceTypes: [resourceType],
        });
        const state = adminResourcesPageReducer(
          initialState,
          selectAdminResourceType(resourceType)
        );
        expect(state.selectedResourceTypes).to.deep.equal([resourceType]);
      });
    });

    describe('UI.UNFILTER_ADMIN_RESOURCE_TYPE', () => {
      it('removes resource type from payload', () => {
        const resourceType = 'type';
        const removedResourceType = 'old type';
        const initialState = Immutable({
          selectedResourceTypes: [removedResourceType, resourceType],
        });
        const state = adminResourcesPageReducer(
          initialState,
          unselectAdminResourceType(removedResourceType)
        );
        expect(state.selectedResourceTypes).to.deep.equal([resourceType]);
      });
    });

    describe('API.RESOURCES_GET_SUCCESS', () => {
      const getResourceSuccess = createAction(
        types.API.RESOURCES_GET_SUCCESS,
        payload => payload,
        (payload, meta) => meta
      );
      const resourcesList = [
        Resource.build(),
        Resource.build(),
        Resource.build(),
      ];
      const resources = {
        [resourcesList[0].id]: resourcesList[0],
        [resourcesList[1].id]: resourcesList[1],
        [resourcesList[2].id]: resourcesList[2],
      };

      describe('with correct meta source', () => {
        let action;

        beforeEach(() => {
          action = getResourceSuccess(
            {
              entities: { resources },
            },
            { source: 'adminResourcesPage' }
          );
        });

        it('adds resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).to.deep.equal([
            resourcesList[0].id,
            resourcesList[1].id,
            resourcesList[2].id,
          ]);
        });

        it('overrides resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: ['1', '2', '3'],
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).to.deep.equal([
            resourcesList[0].id,
            resourcesList[1].id,
            resourcesList[2].id,
          ]);
        });
      });
      describe('with incorrect meta source', () => {
        let action;

        beforeEach(() => {
          action = getResourceSuccess({
            entities: {
              resources: { resources },
            },
          });
        });

        it('does not add resources ids to state if meta source is not adminResourcesPage', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);

          expect(nextState.resourceIds).to.deep.equal([]);
        });
      });

      describe('which are not public', () => {
        const publicResource = Resource.build();
        const nonPublicResource = Resource.build({ public: false });

        let action;
        beforeEach(() => {
          action = getResourceSuccess(
            {
              entities: {
                resources: {
                  [publicResource.id]: publicResource,
                  [nonPublicResource.id]: nonPublicResource,
                },
              },
            },
            { source: 'adminResourcesPage' }
          );
        });

        it('adds resources ids to state', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);

          expect(nextState.resourceIds).to.deep.equal([publicResource.id, nonPublicResource.id]);
        });
      });
    });
  });
});
