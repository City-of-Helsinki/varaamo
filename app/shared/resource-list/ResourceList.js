import React, { PropTypes } from 'react';

import ResourceCard from 'shared/resource-card';


function ResourceList({ date, emptyMessage, location, resourceIds }) {
  function renderResourceListItem(resourceId) {
    return (
      <ResourceCard
        date={date}
        key={resourceId}
        location={location}
        resourceId={resourceId}
      />
    );
  }
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
  date: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
  location: PropTypes.object.isRequired,
  resourceIds: PropTypes.array.isRequired,
};

export default ResourceList;
