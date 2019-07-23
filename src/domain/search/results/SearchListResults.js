import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import get from 'lodash/get';
import find from 'lodash/find';
import omit from 'lodash/omit';
import { withRouter } from 'react-router-dom';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import moment from 'moment';

import constants from '../../../../app/constants/AppConstants';
import SearchSort from '../sort/SearchSort';
import SearchPagination from '../pagination/SearchPagination';
import ResourceCard from '../../resource/card/ResourceCard';
import * as searchUtils from '../utils';

class SearchListResults extends React.Component {
  static propTypes = {
    resources: PropTypes.array.isRequired,
    units: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    totalCount: PropTypes.number,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onFavoriteClick: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
  };

  onSortChange = (sort) => {
    const { history, location } = this.props;
    const filters = searchUtils.getFiltersFromUrl(location);

    const newFilters = {
      ...omit(filters, 'orderBy'),
    };

    if (sort) {
      newFilters.orderBy = sort;
    }

    history.push({
      search: searchUtils.getSearchFromFilters(newFilters),
    });
  };

  onFilterClick = (filterName, filterValue) => {
    const { onFiltersChange } = this.props;

    onFiltersChange({ [filterName]: filterValue });
  };

  render() {
    const {
      isLoading,
      resources,
      units,
      location,
      history,
      totalCount,
      onFavoriteClick,
    } = this.props;

    const filters = searchUtils.getFiltersFromUrl(location);

    return (
      <div className="app-SearchListResults">
        <div className="app-SearchListResults__sort">
          <Row>
            <Col md={4} mdOffset={8} sm={6}>
              <SearchSort
                onChange={sort => this.onSortChange(sort)}
                value={get(filters, 'order_by', '')}
              />
            </Col>
          </Row>
        </div>
        <Loader loaded={!isLoading}>
          <div className="app-SearchListResults__results">
            {resources && resources.map((resource) => {
              const unit = find(units, item => item.id === resource.unit);

              if (unit) {
                return (
                  <ResourceCard
                    date={get(filters, 'date', moment().format(constants.DATE_FORMAT))}
                    key={`resourceCard-${resource.id}`}
                    onFavoriteClick={onFavoriteClick}
                    onFilterClick={this.onFilterClick}
                    resource={resource}
                    unit={unit}
                  />
                );
              }

              return null;
            })}
          </div>
        </Loader>
        <SearchPagination
          onChange={newPage => history.push({
            search: searchUtils.getSearchFromFilters({ ...filters, page: newPage }),
          })}
          page={filters && filters.page ? Number(filters.page) : 1}
          pages={totalCount / constants.SEARCH_PAGE_SIZE}
        />
      </div>
    );
  }
}

export default withRouter(SearchListResults);
