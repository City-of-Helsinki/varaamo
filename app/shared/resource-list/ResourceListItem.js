import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import ResourceIcons from 'shared/resource-icons';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { getName } from 'utils/translationUtils';
import ReserveButton from './ReserveButton';
import ResourceAvailability from './ResourceAvailability';

class ResourceListItem extends Component {
  getBackgroundImageStyles(image) {
    if (image && image.url) {
      return { backgroundImage: `url(${image.url}?dim=700x420)` };
    }
    return {};
  }

  render() {
    const { isLoggedIn, resource, unit } = this.props;
    const date = this.context.location.query.date;

    return (
      <li className="resource-list-item">
        <Link to={getResourcePageUrl(resource, date)}>
          <div
            className="image-container"
            style={this.getBackgroundImageStyles(getMainImage(resource.images))}
          >
            <ResourceAvailability date={date} resource={resource} />
          </div>
        </Link>
        <div className="content">
          <ResourceIcons resource={resource} />
          <Link to={getResourcePageUrl(resource, date)}>
            <h4>{getName(resource)}</h4>
          </Link>
          <div className="unit-name">{getName(unit)}</div>
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
