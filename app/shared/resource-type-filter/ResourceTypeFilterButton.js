import classnames from 'classnames';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

function ResourceTypeFilterButton({ active, onClick, resourceType }) {
  return (
    <Button
      bsStyle={classnames({ primary: active, default: !active })}
      className="resource-type-button"
      onClick={() => onClick(resourceType)}
    >
      {resourceType}
    </Button>
  );
}

ResourceTypeFilterButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resourceType: PropTypes.string.isRequired,
};

export default ResourceTypeFilterButton;
