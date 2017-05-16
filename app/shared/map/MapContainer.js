import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';

import selector from './mapSelector';
import Markers from './Markers';

const defaultPosition = [60.372465778991284, 24.818115234375004];
const defaultZoom = 10;

export class UnconnectedMapContainer extends React.Component {
  constructor() {
    super();
    this.onMapRef = this.onMapRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.map && prevProps.boundaries !== this.props.boundaries) {
      this.fitMapToBoundaries();
    }
  }

  onMapRef(map) {
    this.map = map;
    this.fitMapToBoundaries();
  }

  getBounds() {
    const boundaries = this.props.boundaries;
    return [
      [boundaries.minLatitude, boundaries.minLongitude],
      [boundaries.maxLatitude, boundaries.maxLongitude],
    ];
  }

  hasBoundaries() {
    const boundaries = this.props.boundaries;
    return (
      boundaries.minLatitude ||
      boundaries.minLongitude ||
      boundaries.maxLatitude ||
      boundaries.maxLongitude
    );
  }

  fitMapToBoundaries() {
    if (this.props.isLoaded && this.hasBoundaries()) {
      this.map.leafletElement.fitBounds(this.getBounds());
    }
  }

  render() {
    return (
      <Map
        className="map"
        center={defaultPosition}
        zoom={defaultZoom}
        zoomControl={false}
        ref={this.onMapRef}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/city-of-helsinki/cj0w88p4j00qw2rnp9h8ylt7s/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2l0eS1vZi1oZWxzaW5raSIsImEiOiJjaXdwMTg1bXowMDBoMnZueHlod2RqbXRyIn0.7FKlCDKY-lDr2BNFbNlQ1w"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        <Markers markers={this.props.markers} />
      </Map>
    );
  }
}

UnconnectedMapContainer.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  markers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
  })),
  boundaries: PropTypes.shape({
    maxLatitude: PropTypes.number,
    minLatitude: PropTypes.number,
    maxLongitude: PropTypes.number,
    minLongitude: PropTypes.number,
  }),
};

export default connect(selector)(UnconnectedMapContainer);
