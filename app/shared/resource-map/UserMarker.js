import L from 'leaflet';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import React, { PropTypes } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';

import iconRetinaUrl from 'assets/map/usermarker-icon-2x.png';
import iconUrl from 'assets/map/usermarker-icon.png';

UserMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

function UserMarker(props) {
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
      position={[props.latitude, props.longitude]}
    />
  );
}

export default UserMarker;
