import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import React, { PropTypes } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';

import highlightedIconRetinaUrl from 'assets/map/highlighted-marker-icon-2x.png';

class Marker extends React.Component {
  handleClick = () => {
    this.props.selectUnit(this.props.unitId);
  }

  render() {
    const commonIcon = {
      className: 'marker-icon',
      iconAnchor: [12, 48],
      iconSize: [25, 48],
    };
    const count = (
      this.props.resourceIds.length > 1 ?
      this.props.resourceIds.length :
      ''
    );
    const icon = L.divIcon({
      ...commonIcon,
      html: `<div>${count}</div><img src="${iconRetinaUrl}" />`,
    });

    const highlightedIcon = L.divIcon({
      ...commonIcon,
      html: `<div>${count}</div><img src="${highlightedIconRetinaUrl}" />`,
    });
    return (
      <LeafletMarker
        icon={this.props.highlighted ? highlightedIcon : icon}
        onClick={this.handleClick}
        position={[this.props.latitude, this.props.longitude]}
      />
    );
  }
}

Marker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  resourceIds: PropTypes.array.isRequired,
  unitId: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
  selectUnit: PropTypes.func.isRequired,
};

export default Marker;
