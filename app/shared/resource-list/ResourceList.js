import React, { PropTypes } from 'react';

import ResourceCard from 'shared/resource-card';

function renderResourceListItem(resourceId) {
  return <ResourceCard key={resourceId} resourceId={resourceId} />;
}

function ResourceList({ emptyMessage, resourceIds }) {
  if (!resourceIds.length) {
    return emptyMessage ? <p>{emptyMessage}</p> : <div />;
  }

  return (
    <div className="resource-list">
      {resourceIds.map(renderResourceListItem)}
    </div>
  );
}

ResourceList.propTypes = {
  emptyMessage: PropTypes.string,
  resourceIds: PropTypes.array.isRequired,
};

export default ResourceList;
