import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';

const resourceIdsSelector = (state, props) => props.resourceIds;
const filteredResourcesSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => resourceIds.map(id => resources[id])
);

const markersSelector = createSelector(
  filteredResourcesSelector,
  unitsSelector,
  (resources, units) => resources.map(resource => ({
    latitude: units[resource.unit].location.coordinates[1],
    longitude: units[resource.unit].location.coordinates[0],
    resourceId: resource.id,
  }))
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
  markers: markersSelector,
  boundaries: boundariesSelector,
});
