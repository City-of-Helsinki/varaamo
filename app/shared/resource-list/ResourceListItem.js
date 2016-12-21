import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import BackgroundImage from 'shared/background-image';
import ResourceIcons from 'shared/resource-icons';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ReserveButton from './ReserveButton';
import ResourceAvailability from './ResourceAvailability';

class ResourceListItem extends Component {
  render() {
    const { isLoggedIn, resource, unit } = this.props;
    const date = this.context.location.query.date;

    return (
      <li className="resource-list-item">
        <Link to={getResourcePageUrl(resource, date)}>
          <BackgroundImage
            height={420}
            image={getMainImage(resource.images)}
            width={700}
          >
            <ResourceAvailability date={date} resource={resource} />
          </BackgroundImage>
        </Link>
        <div className="content">
          <ResourceIcons resource={resource} />
          <Link to={getResourcePageUrl(resource, date)}>
            <h4>{resource.name}</h4>
          </Link>
          <div className="unit-name">{unit.name}</div>
          <div className="controls">
            <ReserveButton date={date} isLoggedIn={isLoggedIn} resource={resource} />
          </div>
        </div>
      </li>
    );
  }
}

ResourceListItem.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceListItem.contextTypes = {
  location: React.PropTypes.object,
};

export default ResourceListItem;
