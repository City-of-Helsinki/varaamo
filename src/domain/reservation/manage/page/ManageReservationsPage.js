import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Loader from 'react-loader';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../../../../app/pages/PageWrapper';
import injectT from '../../../../../app/i18n/injectT';
import client from '../../../../common/api/client';
import ManageReservationsList from '../list/ManageReservationsList';
import Pagination from '../../../../common/pagination/Pagination';
import * as searchUtils from '../../../search/utils';

export const PAGE_SIZE = 8;

class ManageReservationsPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingUnits: false,
      reservations: [],
      units: [],
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.loadUnits();
    this.loadReservations();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (prevProps.location !== location) {
      this.loadReservations();
    }
  }

  loadReservations = () => {
    const {
      location,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    const filters = searchUtils.getFiltersFromUrl(location, false);
    const params = {
      ...filters,
      page_size: PAGE_SIZE,
    };

    client.get('reservation', params)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          reservations: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
        });
      });
  };

  loadUnits = () => {
    this.setState({
      isLoadingUnits: true,
    });

    client.get('unit', { page_size: 500, unit_has_resource: true })
      .then(({ data }) => {
        this.setState({
          isLoadingUnits: false,
          units: get(data, 'results', []),
        });
      });
  };

  render() {
    const {
      t,
      history,
      location,
    } = this.props;

    const {
      isLoading,
      isLoadingUnits,
      reservations,
      units,
      totalCount,
    } = this.state;

    const filters = searchUtils.getFiltersFromUrl(location, false);

    return (
      <div className="app-ManageReservationsPage">
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={t('ManageReservationsPage.title')}>
            <Loader loaded={!isLoading && !isLoadingUnits}>
              <ManageReservationsList
                reservations={reservations}
                units={units}
              />
            </Loader>
            <Pagination
              onChange={newPage => history.push({
                search: searchUtils.getSearchFromFilters({ ...filters, page: newPage }),
              })}
              page={filters && filters.page ? Number(filters.page) : 1}
              pages={Math.round(totalCount / PAGE_SIZE)}
            />
          </PageWrapper>
        </div>
      </div>
    );
  }
}

export const UnwrappedManageReservationsPage = injectT(ManageReservationsPage);
export default withRouter(UnwrappedManageReservationsPage);
