import capitalize from 'lodash/string/capitalize';
import React, { Component, PropTypes } from 'react';
import AutoLinkText from 'react-autolink-text';

class ResourceDetails extends Component {
  render() {
    const { capacityString, description, type } = this.props;

    return (
      <div>
        <p>{capitalize(type)} {capacityString}</p>
        <p>
          <AutoLinkText text={description} />
        </p>
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
