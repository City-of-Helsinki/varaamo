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
    if (fetchParams.purpose) {
      actions.searchResources(fetchParams);
    }
    actions.fetchUnits();
  }

  render() {
    const {
      filters,
      isFetchingSearchResults,
      results,
      searchDone,
      units,
    } = this.props;

    return (
      <DocumentTitle title="Haku - Respa">
        <div className="search-page">
          <h1>Haku</h1>
          <SearchControls />
          {searchDone || isFetchingSearchResults ? (
            <SearchResults
              date={filters.date}
              filters={filters}
              isFetching={isFetchingSearchResults}
              results={results}
              searchDone={searchDone}
              units={units}
            />
          ) : (
            <p className="help-text">
              Etsi tilaa syöttämällä hakukenttään tilan nimi tai tilaan liittyvää tietoa.
            </p>
          )}
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
  searchDone: PropTypes.bool.isRequired,
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
