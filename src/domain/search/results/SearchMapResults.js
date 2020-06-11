import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import Loader from 'react-loader';

import ResourceCardSlider from '../../resource/card/slider/ResourceCardSlider';
import UnitMarker from '../../../common/map/UnitMarker';
import UserMarker from '../../../common/map/UserMarker';
import * as searchUtils from '../utils';
import constants from '../../../../app/constants/AppConstants';

/**
 * Groups the given resources by unit.
 * @param resources
 */
const groupResourcesByUnit = (resources) => {
  const grouped = {};

  resources.forEach((resource) => {
    const unitId = resource.unit;

    if (!grouped[unitId]) {
      grouped[unitId] = [];
    }

    grouped[unitId].push(resource);
  });

  return grouped;
};

class SearchMapResults extends React.Component {
  static propTypes = {
    position: PropTypes.arrayOf(Number),
    units: PropTypes.array,
    resources: PropTypes.array,
    isLoading: PropTypes.bool,
    onFavoriteClick: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedUnit: null,
      unitResources: null,
    };
  }

  onUnitMarkerClick = (unit, resources) => {
    this.setState({
      selectedUnit: unit,
      unitResources: resources,
    });
  };

  onFilterClick = (filterName, filterValue) => {
    const { onFiltersChange } = this.props;

    onFiltersChange({ [filterName]: filterValue });
  };

  onMapClick = () => {
    this.setState({
      selectedUnit: null,
      unitResources: null,
    });
  };

  getMapBounds = () => {
    const { units, resources, position } = this.props;
    const unitIds = {};

    resources.forEach((resource) => {
      unitIds[resource.unit] = true;
    });

    let maxLatitude = null;
    let minLatitude = null;
    let maxLongitude = null;
    let minLongitude = null;

    const compareCoordinates = (coordinates) => {
      maxLatitude =
        maxLatitude !== null
          ? Math.max(maxLatitude, coordinates[0])
          : coordinates[0];
      minLatitude =
        minLatitude !== null
          ? Math.min(minLatitude, coordinates[0])
          : coordinates[0];
      maxLongitude =
        maxLongitude !== null
          ? Math.max(maxLongitude, coordinates[1])
          : coordinates[1];
      minLongitude =
        minLongitude !== null
          ? Math.min(minLongitude, coordinates[1])
          : coordinates[1];
    };

    units.forEach((unit) => {
      if (unitIds[unit.id]) {
        const unitCoordinates = get(unit, 'location.coordinates');
        compareCoordinates([unitCoordinates[1], unitCoordinates[0]]);
      }
    });

    if (!minLatitude || !minLongitude || !maxLatitude || !maxLongitude) {
      return undefined;
    }

    if (position) {
      compareCoordinates(position);
    }

    return [
      [minLatitude, minLongitude],
      [maxLatitude, maxLongitude],
    ];
  };

  render() {
    const {
      isLoading,
      units,
      resources,
      onFavoriteClick,
      position,
    } = this.props;

    const { selectedUnit, unitResources } = this.state;

    const groupedResources = groupResourcesByUnit(resources);
    // eslint-disable-next-line no-restricted-globals
    const filters = searchUtils.getFiltersFromUrl(location);

    const tileLayerUrl =
      // eslint-disable-next-line max-len
      'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmFyYWFtbyIsImEiOiJjamU2cWhmdTUwM2ZmMzFud2dvZzFqb2dnIn0.Mj6YrtV9RbJXiU82dqqwhw';

    return (
      <div className="app-SearchMapResults">
        <Loader loaded={!isLoading}>
          <>
            <Map
              bounds={this.getMapBounds()}
              boundsOptions={{ padding: [50, 50] }}
              className="app-SearchMapResults__map"
              onClick={this.onMapClick}
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url={tileLayerUrl}
              />
              <ZoomControl position="bottomright" />
              {units.map((unit) => {
                if (!groupedResources[unit.id]) {
                  return null;
                }

                return (
                  <UnitMarker
                    isHighlighted={selectedUnit && selectedUnit.id === unit.id}
                    key={`unitMarker-${unit.id}`}
                    onClick={this.onUnitMarkerClick}
                    resources={groupedResources[unit.id]}
                    unit={unit}
                  />
                );
              })}
              {position && <UserMarker position={position} />}
            </Map>
            {selectedUnit && (
              <ResourceCardSlider
                date={get(
                  filters,
                  'date',
                  moment().format(constants.DATE_FORMAT)
                )}
                onFavoriteClick={onFavoriteClick}
                onFilterClick={this.onFilterClick}
                resources={unitResources}
                unit={selectedUnit}
              />
            )}
          </>
        </Loader>
      </div>
    );
  }
}

export default SearchMapResults;
