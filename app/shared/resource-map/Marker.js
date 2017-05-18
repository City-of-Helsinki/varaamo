import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import React, { PropTypes } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import { browserHistory } from 'react-router';

import { getResourcePageUrl } from 'utils/resourceUtils';

class Marker extends React.Component {
  handleClick = () => {
    // It redirects to today
    browserHistory.push(getResourcePageUrl({ id: this.props.resourceId }));
  }

  render() {
    // Override default Leaflet icon as there is a bug with leaflet and webpack
    // ref: https://github.com/PaulLeCam/react-leaflet/issues/255
    const icon = L.icon({
      iconAnchor: [12, 41],
      iconRetinaUrl,
      iconSize: [25, 41],
      iconUrl,
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowUrl,
      tooltipAnchor: [16, -28],
    });
    return (
      <LeafletMarker
        icon={icon}
        onClick={this.handleClick}
        position={[this.props.latitude, this.props.longitude]}
      />
    );
  }
}

Marker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  resourceId: PropTypes.string.isRequired,
};

export default Marker;
