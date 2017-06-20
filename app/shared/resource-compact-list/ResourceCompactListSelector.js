import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesSelector } from 'state/selectors/dataSelectors';

const resourceIdsSelector = (state, props) => props.resourceIds;
const unitIdSelector = (state, props) => props.unitId;
const filteredResourceIdsSelector = createSelector(
  unitIdSelector,
  resourceIdsSelector,
  resourcesSelector,
  (unitId, resourceIds, resources) => {
    if (!unitId) {
      return resourceIds;
    }
    return resourceIds.filter(id => resources[id].unit === unitId);
  }
);

export default createStructuredSelector({
  resourceIds: filteredResourceIdsSelector,
});
