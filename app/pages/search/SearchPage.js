import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import PageWrapper from 'pages/PageWrapper';
import DateHeader from 'shared/date-header';
import { scrollTo } from 'utils/domUtils';
import SearchControls from './controls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results';

export class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
  }

  componentDidMount() {
    const { actions, filters, searchDone } = this.props;
    if (searchDone || filters.purpose || filters.people || filters.search) {
      actions.searchResources(filters);
    }
    actions.fetchUnits();
  }

  componentWillUpdate(nextProps) {
    const { filters: currentFilters, actions } = this.props;
    const { filters: nextFilters, searchDone } = nextProps;
    if (isEqual(currentFilters, nextFilters)) {
      return;
    }
    actions.changeSearchFilters(nextFilters);
    if (searchDone || nextFilters.purpose || nextFilters.people || nextFilters.search) {
      actions.searchResources(nextFilters);
    }
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  render() {
    const {
      filters,
      isFetchingSearchResults,
      location,
      params,
      searchResultIds,
      searchDone,
    } = this.props;

    return (
      <PageWrapper className="search-page" title="Haku">
        <h1>Haku</h1>
        <SearchControls
          location={location}
          params={params}
          scrollToSearchResults={this.scrollToSearchResults}
        />
        {searchDone && <DateHeader date={filters.date} />}
        {searchDone || isFetchingSearchResults ? (
          <SearchResults
            isFetching={isFetchingSearchResults}
            ref="searchResults"
            searchResultIds={searchResultIds}
          />
          ) : (
            <p className="help-text">
            Etsi tilaa syöttämällä hakukenttään tilan nimi tai tilaan liittyvää tietoa.
            </p>
        )}
      </PageWrapper>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  searchDone: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchUnits,
    searchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
