import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Link } from 'react-router';

import {
  getHumanizedPeriod,
  getMainImage,
  getName,
} from 'utils/DataUtils';
import ReserveButton from './ReserveButton';

class ResourceListItem extends Component {
  getBackgroundImageStyles(image) {
    if (image && image.url) {
      return { backgroundImage: `url(${image.url}?dim=700x420)` };
    }
    return {};
  }

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

  render() {
    const { date, isLoggedIn, resource, unit } = this.props;

    return (
      <li className="resource-list-item">
        <div
          className="image-container"
          style={this.getBackgroundImageStyles(getMainImage(resource.images))}
        />
        <div className="content">
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
          <div className="controls">
            <ReserveButton date={date} isLoggedIn={isLoggedIn} resource={resource} />
          </div>
        </div>
      </li>
    );
  }
}

ResourceListItem.propTypes = {
  date: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourceListItem;
