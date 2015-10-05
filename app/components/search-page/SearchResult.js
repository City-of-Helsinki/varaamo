import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { getName } from 'utils/DataUtils';

export class SearchResult extends Component {
  render() {
    const { result, unit } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${result.id}`}>
            {result.name.fi}
          </Link>
        </td>
        <td>{getName(unit)}</td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  result: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default SearchResult;
