import upperFirst from 'lodash/upperFirst';
import React, { PropTypes } from 'react';

import WrappedText from 'shared/wrapped-text';
import FavoriteButton from 'shared/favorite-button';
import ResourceIcons from 'shared/resource-icons';
import ImageCarousel from './ImageCarousel';

function getAddress({ addressZip, municipality, name, streetAddress }) {
  const parts = [
    name,
    streetAddress,
    `${addressZip} ${upperFirst(municipality)}`.trim(),
  ];
  return parts.filter(part => part).join(', ');
}

function ResourceInfo({ isAdmin, resource, unit }) {
  return (
    <div className="resource-info">
      {isAdmin && <FavoriteButton resource={resource} />}
      <h1>{resource.name}</h1>
      <p className="address lead">{getAddress(unit)}</p>
      <ResourceIcons resource={resource} />
      <ImageCarousel images={resource.images || []} />
      <WrappedText text={resource.description} />
    </div>
  );
}

ResourceInfo.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourceInfo;
