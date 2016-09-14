import React, { PropTypes } from 'react';

import ResourceListItem from './ResourceListItem';

function renderResourceListItem(resource, units, date) {
  const unit = units[resource.unit] || {};
  return (
    <ResourceListItem
      date={date}
      key={resource.id}
      resource={resource}
      unit={unit}
    />
  );
}

function ResourceList({ date, emptyMessage, resources, units }) {
  if (!resources.length) {
    return emptyMessage ? <p>{emptyMessage}</p> : <div />;
  }

  return (
    <ul className="resource-list">
      {resources.map((resource) => renderResourceListItem(resource, units, date))}
    </ul>
  );
}

ResourceList.propTypes = {
  date: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
  resources: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default ResourceList;
