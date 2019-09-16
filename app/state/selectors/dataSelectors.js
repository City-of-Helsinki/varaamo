import { createSelector } from 'reselect';

import { createTranslatedSelector } from './translationSelectors';
import { currentUserSelector } from './authSelectors';

const purposesSelector = createTranslatedSelector(state => state.data.purposes);
const reservationsSelector = state => state.data.reservations;
const resourcesSelector = createTranslatedSelector(state => state.data.resources);
const unitsSelector = createTranslatedSelector(state => state.data.units);

const userFavouriteResourcesSelector = createSelector(
  currentUserSelector, userData => userData && userData.favoriteResources
);

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
  userFavouriteResourcesSelector
};
