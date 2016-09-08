import capitalize from 'lodash/capitalize';
import React, { Component, PropTypes } from 'react';

import WrappedText from 'components/common/WrappedText';

class ResourceDetails extends Component {
  render() {
    const { capacityString, description, type } = this.props;
    return (
      <div>
        <p>{capitalize(type)} {capacityString}</p>
        <WrappedText text={description} />
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
