import { createSelector } from 'reselect';

import { createTranslatedSelector } from 'state/selectors/translationSelectors';

const purposesSelector = createTranslatedSelector(state => state.data.purposes);
const reservationsSelector = state => state.data.reservations;
const resourcesSelector = createTranslatedSelector(state => state.data.resources);
const unitsSelector = createTranslatedSelector(state => state.data.units);

function createResourceSelector(idSelector) {
  return createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id] || {}
  );
}

export {
  createResourceSelector,
  purposesSelector,
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
};
