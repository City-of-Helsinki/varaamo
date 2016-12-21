import { createSelector } from 'reselect';

import { resourcesSelector } from 'state/selectors/dataSelectors';

const idSelector = (state, props) => props.params.id;

const resourceSelector = createSelector(
  idSelector,
  resourcesSelector,
  (id, resources) => resources[id] || {}
);

export default resourceSelector;
