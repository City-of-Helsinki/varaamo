import classNames from 'classnames';
import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';

import { resourcesSelector } from 'state/selectors/dataSelectors';

ResourceInfo.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  peopleCapacity: PropTypes.number.isRequired,
};
export function ResourceInfo(props) {
  return (
    <div
      className={classNames('resource-info', { 'resource-info-selected': props.isSelected })}
      title={props.name}
    >
      <div className="name">
        <Link to={`/resources/${props.id}?date=${props.date}`}>
          {props.name}
        </Link>
      </div>
      <div className="capacity">
        <Glyphicon glyph="user" /> {props.peopleCapacity}
      </div>
    </div>
  );
}

export function selector() {
  function idSelector(state, props) { return props.id; }
  const resourceSelector = createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id]
  );
  return createSelector(
    resourceSelector,
    resource => ({
      name: resource.name,
      peopleCapacity: resource.peopleCapacity,
    })
  );
}

const ResourceInfoContainer = connect(selector)(ResourceInfo);
ResourceInfoContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
export default ResourceInfoContainer;
