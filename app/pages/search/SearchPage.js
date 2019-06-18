import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { searchResources, toggleMap } from '../../actions/searchActions';
import { changeSearchFilters } from '../../actions/uiActions';
import { fetchPurposes } from '../../actions/purposeActions';
import { fetchUnits } from '../../actions/unitActions';
import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';
import ResourceMap from '../../shared/resource-map/MapContainer';
import SearchControls from './controls/SearchControlsContainer';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results/SearchResults';
import Sort from './Sort';
import MapToggle from './results/MapToggle';

class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.searchResources = this.searchResources.bind(this);
    this.sortResource = this.sortResource.bind(this);
  }

  componentDidMount() {
    const {
      actions, filters, location, searchDone, uiFilters
    } = this.props;
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

  searchResources(filters, position = this.props.position || {}) {
    this.props.actions.searchResources({ ...filters, ...position });
  }

  sortResource(value) {
    const filters = { ...this.props.filters, ...{ orderBy: value } };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  }

  render() {
    const {
      actions,
      isFetchingSearchResults,
      location,
      history,
      match,
      resultCount,
      searchResultIds,
      searchDone,
      selectedUnitId,
      showMap,
      filters,
      t,
    } = this.props;
    return (
      <div className="app-SearchPage">
        <SearchControls location={location} params={match.params} />
        {!isFetchingSearchResults && (
          <MapToggle mapVisible={showMap} onClick={actions.toggleMap} resultCount={resultCount} />
        )}
        {showMap && (
          <ResourceMap
            location={location}
            resourceIds={searchResultIds}
            selectedUnitId={selectedUnitId}
            showMap={showMap}
          />
        )}

        <PageWrapper className="app-SearchPage__wrapper" title={t('SearchPage.title')} transparent>
          <Row className="app-SearchPage__sortControlRow">
            <Col className="app-SearchPage__sortControl" md={4} mdOffset={8} sm={6}>
              <Sort onChange={this.sortResource} sortValue={filters.orderBy} />
            </Col>
          </Row>
          <div className="app-SearchPage__content">
            {(searchDone || isFetchingSearchResults) && (
              <SearchResults
                history={history}
                isFetching={isFetchingSearchResults}
                location={location}
                ref="searchResults"
                resultCount={resultCount}
                searchResultIds={searchResultIds}
                selectedUnitId={selectedUnitId}
                showMap={showMap}
              />
            )}
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
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
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
export default connect(
  searchPageSelector,
  mapDispatchToProps
)(UnconnectedSearchPage);
