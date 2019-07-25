import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon-2x.png';
import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import { Marker } from 'react-leaflet';

import highlightedIcon from '../../../app/assets/map/highlighted-marker-icon-2x.png';

const getIcon = (count, isHighlighted = false) => {
  return L.divIcon({
    className: 'marker-icon',
    iconAnchor: [12, 48],
    iconSize: [25, 48],
    html: `<div>${count}</div><img src="${isHighlighted ? highlightedIcon : icon}" />`,
  });
};

const UnitMarker = ({
  unit,
  resources,
  isHighlighted,
  onClick,
}) => {
  const coordinates = get(unit, 'location.coordinates');

  return (
    <Marker
      icon={getIcon(resources.length, isHighlighted)}
      onClick={() => onClick(unit, resources)}
      position={[coordinates[1], coordinates[0]]}
    />
  );
};

UnitMarker.propTypes = {
  unit: PropTypes.object.isRequired,
  resources: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool,
};

export default UnitMarker;
