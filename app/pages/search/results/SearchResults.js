import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import ResourceCompactList from 'shared/resource-compact-list';
import ResourceList from 'shared/resource-list';
import { scrollTo } from 'utils/domUtils';
import MapToggle from './MapToggle';
import searchResultsSelector from './searchResultsSelector';

export class UnconnectedSearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const {
      date,
      isFetching,
      onToggleMap,
      searchResultIds,
      selectedUnitId,
      showMap,
    } = this.props;
    return (
      <div className="app-SearchResults" id="search-results">
        <Loader loaded={!isFetching}>
          <MapToggle
            mapVisible={showMap}
            onClick={onToggleMap}
            resultsCount={searchResultIds.length || 0}
          />
          {!showMap &&
            <ResourceList
              date={date}
              resourceIds={searchResultIds}
            />
          }
          {showMap && selectedUnitId &&
            <ResourceCompactList
              date={date}
              resourceIds={searchResultIds}
              unitId={selectedUnitId}
            />
          }
        </Loader>
      </div>
    );
  }
}

UnconnectedSearchResults.propTypes = {
  date: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onToggleMap: PropTypes.func.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  selectedUnitId: PropTypes.string,
  showMap: PropTypes.bool.isRequired,
};

export default connect(searchResultsSelector)(UnconnectedSearchResults);
