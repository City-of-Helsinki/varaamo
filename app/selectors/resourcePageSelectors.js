import {createSelector} from 'reselect';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.resources;

export const resourcePageSelectors = createSelector(
  idSelector,
  resourcesSelector,
  (id, resources) => {
    return {
      resource: resources.get(id),
    };
  }
);
