import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import ResourceCompactList from 'shared/resource-compact-list';
import ResourceList from 'shared/resource-list';
import { scrollTo } from 'utils/domUtils';
import SearchResultsPaging from './SearchResultsPaging';
import searchResultsSelector from './searchResultsSelector';
import Sort from '../Sort';

export class UnconnectedSearchResults extends Component {
  componentDidMount() {
    // TODO: fix this lint
    // eslint-disable-next-line react/no-find-dom-node
    scrollTo(findDOMNode(this));
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
      <div className="app-SearchResults" id="search-results">
        <Loader loaded={!isFetching}>
          {!showMap && (
            <div className="app-SearchResults__container">
              <Row>
                <Col className="app-SearchControlsContainer__control sortControl col-md-offset-8" md={4} sm={6}>
                  <Sort />
                </Col>
              </Row>
              <div className="clearFloat" />
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
