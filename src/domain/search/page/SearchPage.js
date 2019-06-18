import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import constants from '../../../../app/constants/AppConstants';
import injectT from '../../../../app/i18n/injectT';
import client from '../../../common/api/client';
import * as searchUtils from '../utils';
import PageWrapper from '../../../../app/pages/PageWrapper';
import SearchFilters from '../filters/SearchFilters';
import SearchListResults from '../results/SearchListResults';
import SearchMapResults from '../results/SearchMapResults';
import SearchMapToggle from '../mapToggle/SearchMapToggle';

class SearchPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      items: [],
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

    const params = {
      ...filters,
      page_size: constants.SEARCH_PAGE_SIZE,
    };

    client.get('resource', params)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          items: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
        });
      });
  };

  isMapActive = () => {
    const { location, match } = this.props;
    return location.pathname !== match.path;
  };

  render() {
    const { t, history, match } = this.props;
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
        <SearchMapToggle
          active={this.isMapActive() ? 'map' : 'list'}
          onClick={(button) => {
            if (button === 'list') {
              history.push({
                pathname: match.path,
                search: location.search,
              });
            } else {
              history.push({
                pathname: `${match.path}/${button}`,
                search: location.search,
              });
            }
          }}
          resultCount={totalCount}
        />
        <PageWrapper className="app-SearchPage__wrapper" title={t('SearchPage.title')} transparent>
          <div className="app-SearchPage__results">
            <Switch>
              <Route
                exact
                path={`${match.path}/map`}
                render={(props) => {
                  return (
                    <SearchMapResults
                      {...props}
                      isLoading={isLoading}
                      resources={items}
                    />
                  );
                }}
              />
              <Route
                exact
                path={match.path}
                render={(props) => {
                  return (
                    <SearchListResults
                      {...props}
                      isLoading={isLoading}
                      resources={items}
                      totalCount={totalCount}
                    />
                  );
                }}
              />
              <Redirect to={match.path} />
            </Switch>
          </div>
        </PageWrapper>
      </div>
    );
  }
}

export default injectT(withRouter(SearchPage));
