import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ResourceCard from 'shared/resource-card';
import selector from './ResourceCompactListSelector';

function renderResourceListItem(resourceId) {
  return <ResourceCard key={resourceId} resourceId={resourceId} />;
}

export function UnconnectedResourceCompactList({ resourceIds }) {
  return (
    <div className="resource-compact-list">
      {resourceIds.map(renderResourceListItem)}
    </div>
  );
}

UnconnectedResourceCompactList.propTypes = {
  resourceIds: PropTypes.array.isRequired,
};

export default connect(selector)(UnconnectedResourceCompactList);
