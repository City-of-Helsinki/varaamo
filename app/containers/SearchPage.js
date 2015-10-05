import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResources } from 'actions/resourceActions';
import SearchResults from 'components/search-page/SearchResults';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

export class UnconnectedSearchPage extends Component {
  componentDidMount() {
    this.props.actions.fetchResources();
  }

  render() {
    const { category, isFetchingSearchResults, results } = this.props;

    return (
      <DocumentTitle title="Haku - Respa">
        <div>
          <h1>Haku</h1>
          <p>Kategoria: {category}</p>
          <h2>Hakutulokset</h2>
          <SearchResults
            isFetching={isFetchingSearchResults}
            results={results}
          />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  category: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool,
  results: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResources }, dispatch) };
}

export default connect(searchPageSelectors, mapDispatchToProps)(UnconnectedSearchPage);
