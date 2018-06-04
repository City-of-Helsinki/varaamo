import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources, toggleMap } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import { fetchPurposes } from 'actions/purposeActions';
import { fetchUnits } from 'actions/unitActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import ResourceMap from 'shared/resource-map';
import { scrollTo } from 'utils/domUtils';
import SearchControls from './controls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results/SearchResults';
import MapToggle from './results/MapToggle';

class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
    this.searchResources = this.searchResources.bind(this);
  }

  componentDidMount() {
    const { actions, filters, location, searchDone, uiFilters } = this.props;
    actions.fetchPurposes();
    actions.fetchUnits();
    if (!searchDone) {
      this.searchResources(filters);
    }
    if (!isEqual(filters, uiFilters)) {
      this.searchResources(filters);
    }
    if (location.state && location.state.scrollTop) {
      window.setTimeout(() => {
        window.scrollTo(0, location.state.scrollTop);
      }, 100);
    }
  }

  componentWillUpdate(nextProps) {
    const { filters: currentFilters, actions } = this.props;
    const { filters: nextFilters } = nextProps;
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.searchResources(nextFilters);
      return;
    }
    if (!isEqual(nextProps.position, this.props.position)) {
      this.searchResources(nextFilters, nextProps.position);
      return;
    }
    if (isEqual(currentFilters, nextFilters)) {
      const { state: currentState } = this.props.location;
      const { state: nextState } = nextProps.location;
      if (!isEqual(currentState, nextState)) {
        window.scrollTo(0, 0);
      }
      return;
    }
    actions.changeSearchFilters(nextFilters);
    this.searchResources(nextFilters);
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  searchResources(filters, position = this.props.position || {}) {
    this.props.actions.searchResources({ ...filters, ...position });
  }

  render() {
    const {
      actions,
      isFetchingSearchResults,
      location,
      params,
      resultCount,
      searchResultIds,
      searchDone,
      selectedUnitId,
      showMap,
      t,
    } = this.props;
    return (
      <div className="app-SearchPage">
        <SearchControls
          location={location}
          params={params}
          scrollToSearchResults={this.scrollToSearchResults}
        />
        {!isFetchingSearchResults &&
          <MapToggle
            mapVisible={showMap}
            onClick={actions.toggleMap}
            resultCount={resultCount}
          />
        }
        {showMap &&
          <ResourceMap
            location={location}
            resourceIds={searchResultIds}
            selectedUnitId={selectedUnitId}
            showMap={showMap}
          />
        }
        <PageWrapper className="app-SearchPage__wrapper" title={t('SearchPage.title')} transparent>
          <div className="app-SearchPage__content">
            {(searchDone || isFetchingSearchResults) &&
              <SearchResults
                isFetching={isFetchingSearchResults}
                location={location}
                ref="searchResults"
                resultCount={resultCount}
                searchResultIds={searchResultIds}
                selectedUnitId={selectedUnitId}
                showMap={showMap}
              />
            }
          </div>

        </PageWrapper>
      </div>
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
  position: PropTypes.object,
  resultCount: PropTypes.number.isRequired,
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
    fetchPurposes,
    fetchUnits,
    searchResources,
    toggleMap,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchPage };
export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
