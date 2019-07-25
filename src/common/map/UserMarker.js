import L from 'leaflet';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Marker } from 'react-leaflet';

import iconRetinaUrl from '../../../app/assets/map/usermarker-icon-2x.png';
import iconUrl from '../../../app/assets/map/usermarker-icon.png';

const UserMarker = ({ position }) => (
  <Marker
    icon={L.icon({
      iconAnchor: [12, 41],
      iconRetinaUrl,
      iconSize: [25, 41],
      iconUrl,
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowUrl,
      tooltipAnchor: [16, -28],
    })}
    position={position}
  />
);

UserMarker.propTypes = {
  position: PropTypes.arrayOf(Number),
};

export default UserMarker;
