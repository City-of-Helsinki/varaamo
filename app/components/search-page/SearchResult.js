import React, {Component} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export class SearchResult extends Component {
  render() {
    const {result} = this.props;

    return (
      <tr>
        <td>{result.getIn(['name', 'fi'])}</td>
        <td>{result.get('unit')}</td>
      </tr>
    );
  }
}

SearchResult.propTypes = {
  result: ImmutablePropTypes.map.isRequired,
};

export default SearchResult;
