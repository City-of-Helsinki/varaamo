import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.resources;

export const resourcePageSelectors = createSelector(
  idSelector,
  resourcesSelector,
  (id, resources) => {
    return {
      id,
      resource: resources[id] || Immutable({}),
    };
  }
);
