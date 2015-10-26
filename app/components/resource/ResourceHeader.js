import React, { Component, PropTypes } from 'react';

class ResourceHeader extends Component {
  render() {
    const { address, name } = this.props;

    return (
      <div>
        <h1>{name}</h1>
        <address>{address}</address>
      </div>
    );
  }
}

ResourceHeader.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default ResourceHeader;
