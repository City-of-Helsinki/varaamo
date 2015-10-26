import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import {
  getAvailableTime,
  getName,
  getOpeningHours,
} from 'utils/DataUtils';

export class SearchResult extends Component {
  render() {
    const { result, unit } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${result.id}`}>
            {getName(result)}
          </Link>
        </td>
        <td>{getName(unit)}</td>
        <td>{getAvailableTime(getOpeningHours(result), result.reservations)}</td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  result: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default SearchResult;
