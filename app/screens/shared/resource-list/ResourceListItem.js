import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Link } from 'react-router';

import {
  getCaption,
  getHumanizedPeriod,
  getMainImage,
  getName,
} from 'utils/DataUtils';

class ResourceListItem extends Component {
  renderIcon(glyph, text) {
    if (!text) {
      return null;
    }

    return (
      <span>
        <Glyphicon glyph={glyph} />
        <span className="text">{text}</span>
      </span>
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

    return (
      <li className="resource-list-item">
        <div className="image">
          {this.renderImage(getMainImage(resource.images))}
        </div>
        <div className="icons">
          {this.renderIcon('user', resource.peopleCapacity)}
          {this.renderIcon('time', getHumanizedPeriod(resource.maxPeriod))}
        </div>
        <Link
          to={`/resources/${resource.id}`}
          query={{ date: date.split('T')[0] }}
        >
          <h4>{getName(resource)}</h4>
        </Link>
        <div className="unit-name">{getName(unit)}</div>
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
