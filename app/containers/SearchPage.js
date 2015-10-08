import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import SearchResults from 'components/search/SearchResults';
import SearchControls from 'containers/SearchControls';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

export class UnconnectedSearchPage extends Component {
  componentDidMount() {
    const { actions, filters } = this.props;
    actions.fetchResources(filters);
    actions.fetchUnits();
  }

  render() {
    const { isFetchingSearchResults, results, units } = this.props;

    return (
      <DocumentTitle title="Haku - Respa">
        <div>
          <h1>Haku</h1>
          <SearchControls />
          <h2>Hakutulokset</h2>
          <SearchResults
            isFetching={isFetchingSearchResults}
            results={results}
            units={units}
          />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool,
  filters: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResources, fetchUnits }, dispatch) };
}

export default connect(searchPageSelectors, mapDispatchToProps)(UnconnectedSearchPage);
