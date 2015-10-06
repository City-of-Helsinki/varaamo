import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

export class ResourceDetails extends Component {
  render() {
    const { capacityString, description, type } = this.props;

    return (
      <div>
        <p>{_.capitalize(type)} {capacityString}</p>
        <p>{description}</p>
      </div>
    );
  }
}

ResourceDetails.propTypes = {
  capacityString: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ResourceDetails;
