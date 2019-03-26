import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';

class ResourceTypeFilterContainer extends Component {
  static propTypes = {
    selectedResourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectResourceType: PropTypes.func.isRequired,
    onUnselectResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleRangeClick: PropTypes.func.isRequired,
    activeRange: PropTypes.string.isRequired,
    ranges: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    const {
      t,
      activeRange,
      selectedResourceTypes,
      ranges,
      resourceTypes,
      handleRangeClick
    } = this.props;
    return (
      <div className="resource-type-filter-container">
        <h6>{t('ResourceTypeFilter.title')}</h6>
        <div className="resource-type__filter-groups">
          <div className="resource-type__single-group">
            { ranges.map(range => (
              <ResourceTypeFilterButton
                active={range === activeRange}
                key={`resource-range-${range}`}
                onClick={handleRangeClick}
                resourceType={range}
              />
            ))}
          </div>
          <div className="resource-type-filter-group">
            { resourceTypes.map(resourceType => (
              <ResourceTypeFilterButton
                active={includes(selectedResourceTypes, resourceType)}
                key={`resource-type-${resourceType}`}
                onClick={this.handleClick}
                resourceType={resourceType}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
ResourceTypeFilterContainer = injectT(ResourceTypeFilterContainer);  // eslint-disable-line

export default ResourceTypeFilterContainer;
