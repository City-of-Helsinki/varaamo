import React, { Component, PropTypes } from 'react';
import Label from 'react-bootstrap/lib/Label';
import { Link } from 'react-router';

import {
  getAvailableTime,
  getCaption,
  getMainImage,
  getName,
  getOpeningHours,
} from 'utils/DataUtils';

class ResourceListItem extends Component {
  renderAvailableTime(availableTime) {
    let bsStyle = 'success';
    if (availableTime === '0 tuntia vapaana') {
      bsStyle = 'danger';
    }
    return (
      <Label bsStyle={bsStyle}>{availableTime}</Label>
    );
  }

  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=100x100`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  render() {
    const { date, resource, unit } = this.props;
    const availableTime = getAvailableTime(getOpeningHours(resource), resource.reservations);

    return (
      <li>
        <div className="image">
          <Link
            to={`/resources/${resource.id}`}
            query={{ date: date.split('T')[0] }}
          >
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="names">
          <Link
            to={`/resources/${resource.id}`}
            query={{ date: date.split('T')[0] }}
          >
            <h4>{getName(resource)}</h4>
            <div className="unit-name">{getName(unit)}</div>
          </Link>
        </div>
        <div className="available-time">
          <Link
            to={`/resources/${resource.id}/reservation`}
            query={{ date: date.split('T')[0] }}
          >
            {this.renderAvailableTime(availableTime)}
          </Link>
        </div>
      </li>
    );
  }
}

ResourceListItem.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourceListItem;
