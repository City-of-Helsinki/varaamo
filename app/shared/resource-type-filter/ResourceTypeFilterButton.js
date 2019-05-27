import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

function ResourceTypeFilterButton({ active, onClick, resourceType }) {
  return (
    <Button
      bsStyle={classNames({ primary: active, default: !active })}
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
