import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import Pagination from '../../../../src/common/pagination/Pagination';
import injectT from '../../../i18n/injectT';
import ReservationListItem from './ReservationListItem';
import reservationListSelector from './reservationListSelector';
import { getFiltersFromUrl, getSearchFromFilters } from '../../../../src/domain/search/utils';

class UnconnectedReservationListContainer extends Component {
  constructor(props) {
    super(props);
    this.renderReservationListItem = this.renderReservationListItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { fetchReservations, location, pageSize } = this.props;

    if (prevProps.location !== location) {
      const filters = getFiltersFromUrl(location, false);
      fetchReservations({
        page: filters && filters.page ? Number(filters.page) : 1,
        pageSize,
        all: true,
        isOwn: true,
        ordering: '-begin'
      });
    }
  }

  onPageChange = (newPage) => {
    const { history, location } = this.props;
    const filters = getFiltersFromUrl(location, false);
    history.push({
      search: getSearchFromFilters({ ...filters, page: newPage })
    });
  };

  renderReservationListItem(reservation) {
    const {
      isAdmin,
      resources,
      staffUnits,
      units,
    } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationListItem
        isAdmin={isAdmin}
        isStaff={includes(staffUnits, resource.unit)}
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        unit={unit}
      />
    );
  }

  render() {
    const {
      emptyMessage,
      loading,
      location,
      reservations,
      paginatedReservations,
      pageSize,
      t,
    } = this.props;

    const { comingReservations, pastReservations, count } = paginatedReservations;

    const filters = getFiltersFromUrl(location, false);

    return (
      <Loader loaded={!loading}>
        {reservations.length
          ? (
            <div>
              <ul className="reservation-list">
                {comingReservations.length > 1 && <h1>{t('ReservationListContainer.comingReservations')}</h1>}
                {comingReservations.map(this.renderReservationListItem)}
                {pastReservations.length > 1 && <h1>{t('ReservationListContainer.pastReservations')}</h1>}
                {pastReservations.map(this.renderReservationListItem)}
              </ul>
              <Pagination
                onChange={this.onPageChange}
                page={filters && filters.page ? Number(filters.page) : 1}
                pages={Math.round(count / pageSize)}
              />
            </div>
          )
          : <p>{emptyMessage || t('ReservationListContainer.emptyMessage')}</p>
        }
      </Loader>
    );
  }
}

UnconnectedReservationListContainer.propTypes = {
  emptyMessage: PropTypes.string,
  filter: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  fetchReservations: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  history: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.object,
  paginatedReservations: PropTypes.object.isRequired,
  pageSize: PropTypes.number.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  staffUnits: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  units: PropTypes.object.isRequired,
};
UnconnectedReservationListContainer = injectT(UnconnectedReservationListContainer);  // eslint-disable-line

export { UnconnectedReservationListContainer };
export default connect(reservationListSelector)(UnconnectedReservationListContainer);
