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
      isLoadingUnits: false,
      isLoadingPurposes: false,
      units: [],
      purposes: [],
      resources: [],
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.loadUnits();
    this.loadPurposes();
    this.loadResources();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (prevProps.location !== location) {
      this.loadResources();
    }
  }

  onFiltersChange = (newFilters) => {
    const { history } = this.props;

    history.push({
      search: searchUtils.getSearchFromFilters(newFilters),
    });
  };

  loadUnits = () => {
    this.setState({
      isLoadingUnits: true,
    });

    client.get('unit')
      .then(({ data }) => {
        this.setState({
          isLoadingUnits: false,
          units: get(data, 'results', []),
        });
      });
  };

  loadPurposes = () => {
    this.setState({
      isLoadingPurposes: true,
    });

    client.get('purpose')
      .then(({ data }) => {
        this.setState({
          isLoadingPurposes: false,
          purposes: get(data, 'results', []),
        });
      });
  };

  loadResources = () => {
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
          resources: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
        });
      });
  };

  isMapActive = () => {
    const { location, match } = this.props;
    return location.pathname !== match.path;
  };

  render() {
    const {
      t,
      history,
      match,
    } = this.props;

    const {
      isLoading,
      isLoadingUnits,
      isLoadingPurposes,
      resources,
      units,
      purposes,
      totalCount,
    } = this.state;
    const filters = searchUtils.getFiltersFromUrl(location);

    return (
      <div className="app-SearchPage">
        <SearchFilters
          filters={filters}
          isLoadingPurposes={isLoadingPurposes}
          isLoadingUnits={isLoadingUnits}
          onChange={this.onFiltersChange}
          purposes={purposes}
          units={units}
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
                      resources={resources}
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
                      isLoading={isLoading || isLoadingUnits}
                      resources={resources}
                      totalCount={totalCount}
                      units={units}
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
