import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export class SearchResult extends Component {
  render() {
    const { result } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${result.id}`}>
            {result.name.fi}
          </Link>
        </td>
        <td>{result.unit}</td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  result: PropTypes.object.isRequired,
};

export default SearchResult;
