import { createSelector } from 'reselect';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;

const resourceSelector = createSelector(
  idSelector,
  resourcesSelector,
  (id, resources) => {
    return resources[id] || {};
  }
);

export default resourceSelector;
