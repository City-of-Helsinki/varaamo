import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';

import { injectT } from 'i18n';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';

class ResourceTypeFilterContainer extends Component {
  static propTypes = {
    selectedResourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectResourceType: PropTypes.func.isRequired,
    onUnselectResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    t: PropTypes.func.isRequired,
  };

  handleClick = (resourceType) => {
    const {
      selectedResourceTypes,
      onSelectResourceType,
      onUnselectResourceType,
    } = this.props;
    if (includes(selectedResourceTypes, resourceType)) {
      onUnselectResourceType(resourceType);
    } else {
      onSelectResourceType(resourceType);
    }
  }

  render() {
    const { t, selectedResourceTypes, resourceTypes } = this.props;
    return (
      <div className="resource-type-filter-container">
        <h6>{t('ResourceTypeFilter.title')}</h6>
        { resourceTypes.map(resourceType =>
          <ResourceTypeFilterButton
            active={includes(selectedResourceTypes, resourceType)}
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
