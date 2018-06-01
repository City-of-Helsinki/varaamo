import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import ResourceCompactList from 'shared/resource-compact-list';
import ResourceList from 'shared/resource-list';
import { scrollTo } from 'utils/domUtils';
import SearchResultsPaging from './SearchResultsPaging';
import searchResultsSelector from './searchResultsSelector';

export class UnconnectedSearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const {
      filters,
      isFetching,
      location,
      resultCount,
      searchResultIds,
      selectedUnitId,
      showMap,
    } = this.props;
    return (
      <div className="app-SearchResults" id="search-results">
        <Loader loaded={!isFetching}>
          {!showMap &&
            <div className="app-SearchResults__container">
              <ResourceList
                date={filters.date}
                location={location}
                resourceIds={searchResultIds}
              />
              <SearchResultsPaging
                filters={filters}
                resultCount={resultCount}
              />
            </div>
          }
          {showMap && selectedUnitId &&
            <ResourceCompactList
              date={filters.date}
              location={location}
              resourceIds={searchResultIds}
            />
          }
        </Loader>
      </div>
    );
  }
}

UnconnectedSearchResults.propTypes = {
  filters: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  resultCount: PropTypes.number.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  selectedUnitId: PropTypes.string,
  showMap: PropTypes.bool.isRequired,
};

export default connect(searchResultsSelector)(UnconnectedSearchResults);
