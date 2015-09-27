import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import SearchResult from 'components/search-page/SearchResult';

export class SearchResults extends Component {
  renderSearchResult(result) {
    return <SearchResult key={result.get('id')} result={result} />;
  }

  render() {
    const {results} = this.props;

    return (
      <Table striped>
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Yksikkö</th>
          </tr>
        </thead>
        <tbody>
          {results.map(this.renderSearchResult)}
        </tbody>
      </Table>
    );
  }
}

SearchResults.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
};

export default SearchResults;
