import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import ResourceCompactList from '../../../shared/resource-compact-list';
import ResourceList from '../../../shared/resource-list';
import { scrollTo } from '../../../utils/domUtils';
import SearchResultsPaging from './SearchResultsPaging';
import searchResultsSelector from './searchResultsSelector';

export class UnconnectedSearchResults extends Component {
  constructor(props) {
    super(props);
    this.searchResultsComponent = React.createRef();
  }

  componentDidMount() {
    scrollTo(this.searchResultsComponent.current);
  }

  render() {
    const {
      filters,
      isFetching,
      history,
      location,
      resultCount,
      searchResultIds,
      selectedUnitId,
      showMap,
    } = this.props;
    return (
      <div className="app-SearchResults" id="search-results" ref={this.searchResultsComponent}>
        <Loader loaded={!isFetching}>
          {!showMap && (
            <div className="app-SearchResults__container">
              <ResourceList
                date={filters.date}
                history={history}
                location={location}
                resourceIds={searchResultIds}
              />
              <SearchResultsPaging filters={filters} history={history} resultCount={resultCount} />
            </div>
          )}
          {showMap && selectedUnitId && (
            <ResourceCompactList
              date={filters.date}
              history={history}
              location={location}
              resourceIds={searchResultIds}
              unitId={selectedUnitId}
            />
          )}
        </Loader>
      </div>
    );
  }
}

UnconnectedSearchResults.propTypes = {
  filters: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  resultCount: PropTypes.number.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  selectedUnitId: PropTypes.string,
  showMap: PropTypes.bool.isRequired,
};

export default connect(searchResultsSelector)(UnconnectedSearchResults);
