import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources, toggleMap } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import SearchControls from './controls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results';

class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
    this.searchResources = this.searchResources.bind(this);
  }

  componentDidMount() {
    const { actions, filters, searchDone, uiFilters } = this.props;
    actions.fetchUnits();
    if (!searchDone) {
      this.searchResources(filters);
    }
    if (!isEqual(filters, uiFilters)) {
      this.searchResources(filters);
    }
  }

  componentWillUpdate(nextProps) {
    const { filters: currentFilters, actions } = this.props;
    const { filters: nextFilters } = nextProps;
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.searchResources(nextFilters);
      return;
    }
    if (isEqual(currentFilters, nextFilters)) {
      return;
    }
    actions.changeSearchFilters(nextFilters);
    this.searchResources(nextFilters);
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  searchResources(filters) {
    this.props.actions.searchResources(filters);
  }

  render() {
    const {
      actions,
      isFetchingSearchResults,
      location,
      params,
      searchResultIds,
      searchDone,
      selectedUnitId,
      showMap,
      t,
    } = this.props;

    return (
      <PageWrapper className="app-SearchPage" fluid title={t('SearchPage.title')}>
        <div className="app-SearchPage__content">
          <SearchControls
            location={location}
            params={params}
            scrollToSearchResults={this.scrollToSearchResults}
          />
          {(searchDone || isFetchingSearchResults) &&
            <SearchResults
              isFetching={isFetchingSearchResults}
              onToggleMap={actions.toggleMap}
              ref="searchResults"
              searchResultIds={searchResultIds}
              selectedUnitId={selectedUnitId}
              showMap={showMap}
            />
          }
        </div>
      </PageWrapper>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  searchDone: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  selectedUnitId: PropTypes.string,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  uiFilters: PropTypes.object.isRequired,
};

UnconnectedSearchPage = injectT(UnconnectedSearchPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchUnits,
    searchResources,
    toggleMap,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchPage };
export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
