import pickBy from 'lodash/pickBy';

import { createSelector, createStructuredSelector } from 'reselect';

import { unitMatchesFilters } from 'screens/utils';
import selectors from 'state/selectors';

const filteredUnitsSelector = createSelector(
  selectors.unitsSelector,
  selectors.cityFilterSelector,
  selectors.ownerFilterSelector,
  selectors.postalCodeFilterSelector,
  (units, city, owners, postalCodes) => pickBy(
    units,
    unit => unitMatchesFilters(unit, city, owners, postalCodes)
  )
);

const markersSelector = createSelector(
  filteredUnitsSelector,
  (units) => {
    const ids = Object.keys(units).sort();
    return ids.map(id => ({
      id,
      latitude: units[id].coordinates.latitude,
      longitude: units[id].coordinates.longitude,
      owner: units[id].owner,
    }));
  }
);

const boundariesSelector = createSelector(
  markersSelector,
  (markers) => {
    const padding = 0.004;
    let maxLatitude;
    let minLatitude;
    let maxLongitude;
    let minLongitude;
    for (const marker of markers) {
      if (maxLatitude === undefined || marker.latitude > maxLatitude) {
        maxLatitude = marker.latitude;
      }
      if (minLatitude === undefined || marker.latitude < minLatitude) {
        minLatitude = marker.latitude;
      }
      if (maxLongitude === undefined || marker.longitude > maxLongitude) {
        maxLongitude = marker.longitude;
      }
      if (minLongitude === undefined || marker.longitude < minLongitude) {
        minLongitude = marker.longitude;
      }
    }
    return {
      maxLatitude: maxLatitude + padding,
      minLatitude: minLatitude - padding,
      maxLongitude: maxLongitude + padding,
      minLongitude: minLongitude - padding,
    };
  }
);

export default createStructuredSelector({
  isLoaded: selectors.isLoadedSelector,
  markers: markersSelector,
  boundaries: boundariesSelector,
});
