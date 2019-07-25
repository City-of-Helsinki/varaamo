import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import Loader from 'react-loader';

import ResourceCardSlider from '../../resource/card/slider/ResourceCardSlider';
import UnitMarker from '../../../common/map/UnitMarker';
import * as searchUtils from '../utils';
import constants from '../../../../app/constants/AppConstants';
import ResourceCard from "../../resource/card/ResourceCard";

const defaultPosition = {
  null: [60.18952, 24.99545],
  ESPOO: [60.205490, 24.755899],
  VANTAA: [60.29414, 25.14099],
};
const defaultZoom = 12;

const groupResourcesByUnit = (units, resources) => {
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

  render() {
    const {
      isLoading,
      units,
      resources,
      onFavoriteClick,
    } = this.props;

    const {
      selectedUnit,
      unitResources,
    } = this.state;

    const groupedResources = groupResourcesByUnit(units, resources);
    const filters = searchUtils.getFiltersFromUrl(location);

    return (
      <div className="app-SearchMapResults">
        <Loader loaded={!isLoading}>
          <React.Fragment>
            <Map
              center={defaultPosition.null}
              className="app-SearchMapResults__map"
              zoom={defaultZoom}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmFyYWFtbyIsImEiOiJjamU2cWhmdTUwM2ZmMzFud2dvZzFqb2dnIn0.Mj6YrtV9RbJXiU82dqqwhw"
              />
              <ZoomControl position="bottomright" />
              {units.map((unit) => {
                if (!groupedResources[unit.id]) {
                  return null;
                }

                return (
                  <UnitMarker
                    key={`unitMarker-${unit.id}`}
                    onClick={this.onUnitMarkerClick}
                    resources={groupedResources[unit.id]}
                    unit={unit}
                  />
                );
              })}
            </Map>
            {selectedUnit && (
              <ResourceCardSlider
                date={get(filters, 'date', moment().format(constants.DATE_FORMAT))}
                onFavoriteClick={onFavoriteClick}
                onFilterClick={this.onFilterClick}
                resources={unitResources}
                unit={selectedUnit}
              />
            )}
          </React.Fragment>
        </Loader>
      </div>
    );
  }
}

export default SearchMapResults;
