import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';

import { injectT } from 'i18n';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';

class ResourceTypeFilterContainer extends Component {
  static propTypes = {
    filteredResourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onFilterResourceType: PropTypes.func.isRequired,
    onUnfilterResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    t: PropTypes.func.isRequired,
  };

  handleClick = (resourceType) => {
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
    const t = this.props.t;
    return (
      <div className="resource-type-filter-container">
        <h6>{t('ResourceTypeFilter.title')}</h6>
        { this.props.resourceTypes.map(resourceType =>
          <ResourceTypeFilterButton
            active={includes(this.props.filteredResourceTypes, resourceType)}
            key={`resource-type-${resourceType}`}
            onClick={this.handleClick}
            resourceType={resourceType}
          />
        )}
      </div>
    );
  }
}
ResourceTypeFilterContainer = injectT(ResourceTypeFilterContainer);  // eslint-disable-line

export default ResourceTypeFilterContainer;
