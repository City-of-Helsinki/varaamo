import React, { PropTypes } from 'react';

import WrappedText from 'shared/wrapped-text';
import FavoriteButton from 'shared/favorite-button';
import ResourceIcons from 'shared/resource-icons';
import { getName, getProperty } from 'utils/translationUtils';
import { getAddressWithName } from 'utils/unitUtils';
import ImageCarousel from './ImageCarousel';

function ResourceInfo({ isAdmin, resource, unit }) {
  return (
    <div className="resource-info">
      {isAdmin && <FavoriteButton resource={resource} />}
      <h1>{getName(resource)}</h1>
      <address className="lead">{getAddressWithName(unit)}</address>
      <ResourceIcons resource={resource} />
      <ImageCarousel
        altText={`Kuva ${getName(resource)} tilasta`}
        images={resource.images || []}
      />
      <WrappedText text={getProperty(resource, 'description')} />
    </div>
  );
}

ResourceInfo.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourceInfo;
