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
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import SearchControls from './controls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results';

class UnconnectedSearchPage extends Component {
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
      t,
    } = this.props;

    return (
      <PageWrapper className="search-page" title={t('SearchPage.title')}>
        <h1>{t('SearchPage.title')}</h1>
        <SearchControls
          location={location}
          params={params}
          scrollToSearchResults={this.scrollToSearchResults}
        />
        {searchDone && <DateHeader date={filters.date} />}
        {searchDone || isFetchingSearchResults ?
          <SearchResults
            isFetching={isFetchingSearchResults}
            ref="searchResults"
            searchResultIds={searchResultIds}
          />
          : <p className="help-text">{t('SearchPage.helpText')}</p>
        }
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
  t: PropTypes.func.isRequired,
};

UnconnectedSearchPage = injectT(UnconnectedSearchPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchUnits,
    searchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchPage };
export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
