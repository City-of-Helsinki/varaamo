import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import {
  getAvailableTime,
  getCaption,
  getMainImage,
  getName,
  getOpeningHours,
} from 'utils/DataUtils';

class SearchResult extends Component {
  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=80x80`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  render() {
    const { date, result, unit } = this.props;

    return (
      <tr>
        <td style={{ height: '80px', width: '80px' }}>
          {this.renderImage(getMainImage(result.images))}
        </td>
        <td>
          <Link to={`/resources/${result.id}`}>
            {getName(result)}
          </Link>
          <div>{getName(unit)}</div>
        </td>
        <td>
          <Link
            to={`/resources/${result.id}/reservation`}
            query={{ date: date.split('T')[0] }}
          >
            {getAvailableTime(getOpeningHours(result), result.reservations)}
          </Link>
        </td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  date: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default SearchResult;
