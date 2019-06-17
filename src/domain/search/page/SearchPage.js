import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';

import injectT from '../../../../app/i18n/injectT';
import client from '../../../common/api/client';
import * as searchUtils from '../utils';
import PageWrapper from '../../../../app/pages/PageWrapper';
import SearchFilters from '../filters/SearchFilters';
import SearchPagination from '../pagination/SearchPagination';

const PAGE_SIZE = 20;

class SearchPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      items: null,
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.doSearch();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (prevProps.location !== location) {
      this.doSearch();
    }
  }

  onFiltersChange = (newFilters) => {
    const { history } = this.props;

    console.warn(newFilters);

    history.push({
      search: searchUtils.getSearchFromFilters(newFilters),
    });
  };

  doSearch = () => {
    const { location } = this.props;
    const filters = searchUtils.getFiltersFromUrl(location);

    this.setState({
      isLoading: true,
    });

    client.get('resource', filters)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          items: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
        });
      });
  };

  render() {
    const { t, history } = this.props;
    const {
      isLoading,
      items,
      totalCount,
    } = this.state;
    const filters = searchUtils.getFiltersFromUrl(location);

    return (
      <div className="app-SearchPage">
        <SearchFilters
          filters={filters}
          onChange={this.onFiltersChange}
        />
        <PageWrapper className="app-SearchPage__wrapper" title={t('SearchPage.title')} transparent>
          <Loader loaded={!isLoading}>
            <div className="app-SearchPage__results">
              <ul>
                {items && items.map((item, i) => <li key={`item-${i}`}>{item.id}: {item.name.fi}</li>)}
              </ul>
            </div>
          </Loader>
          <div className="app-SearchPage__pagination">
            <SearchPagination
              onChange={newPage => history.push({
                search: searchUtils.getSearchFromFilters({ ...filters, page: newPage }),
              })}
              page={filters && filters.page ? Number(filters.page) : 1}
              pages={totalCount / PAGE_SIZE}
            />
          </div>
        </PageWrapper>
      </div>
    );
  }
}

export default injectT(withRouter(SearchPage));
