import React, {Component} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Link} from 'react-router';

export class SearchResult extends Component {
  render() {
    const {result} = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${result.get('id')}`}>
            {result.getIn(['name', 'fi'])}
          </Link>
        </td>
        <td>{result.get('unit')}</td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  result: ImmutablePropTypes.map.isRequired,
};

export default SearchResult;
