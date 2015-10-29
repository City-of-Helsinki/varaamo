import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources } from 'actions/searchActions';
import { fetchUnits } from 'actions/unitActions';
import SearchResults from 'components/search/SearchResults';
import SearchControls from 'containers/SearchControls';
import searchPageSelector from 'selectors/containers/searchPageSelector';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';

export class UnconnectedSearchPage extends Component {
  componentDidMount() {
    const { actions, filters } = this.props;
    const fetchParams = getFetchParamsFromFilters(filters);

    actions.searchResources(fetchParams);
    actions.fetchUnits();
  }

  render() {
    const {
      filters,
      isFetchingSearchResults,
      results,
      units,
    } = this.props;

    return (
      <DocumentTitle title="Haku - Respa">
        <div>
          <h1>Haku</h1>
          <SearchControls />
          <h2>Hakutulokset</h2>
          <SearchResults
            date={filters.date}
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
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    searchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
