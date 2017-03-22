import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';

import ResourceTypeFilterButton from './ResourceTypeFilterButton';

class ResourceTypeFilterContainer extends Component {
  static propTypes = {
    onFilterResourceType: PropTypes.func.isRequired,
    onUnfilterResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredResourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(resourceType) {
    const {
      filteredResourceTypes,
      onFilterResourceType,
      onUnfilterResourceType,
    } = this.props;
    if (includes(filteredResourceTypes, resourceType)) {
      onUnfilterResourceType(resourceType);
    } else {
      onFilterResourceType(resourceType);
    }
  }

  render() {
    return (
      <div>
        { this.props.resourceTypes.map(resourceType =>
          <ResourceTypeFilterButton
            active={!includes(this.props.filteredResourceTypes, resourceType)}
            key={`resource-type-${resourceType}`}
            onClick={this.handleClick}
            resourceType={resourceType}
          />
        )}
      </div>
    );
  }
}

export default ResourceTypeFilterContainer;
