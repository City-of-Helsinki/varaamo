import { createSelector } from 'reselect';

const idSelector = (state, props) => props.params.id;
const resourcesSelector = state => state.data.resources;

const resourceSelector = createSelector(
  idSelector,
  resourcesSelector,
  (id, resources) => resources[id] || {}
);

export default resourceSelector;
