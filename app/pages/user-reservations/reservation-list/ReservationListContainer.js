import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import ReservationListItem from './ReservationListItem';
import reservationListSelector from './reservationListSelector';

export class UnconnectedReservationListContainer extends Component {
  constructor(props) {
    super(props);
    this.renderReservationListItem = this.renderReservationListItem.bind(this);
  }

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
      reservations,
    } = this.props;

    return (
      <Loader loaded={!loading}>
        {reservations.length ? (
          <div>
            <ul className="reservation-list">
              {reservations.map(this.renderReservationListItem)}
            </ul>
          </div>
        ) : (
          <p>{emptyMessage || 'Sinulla ei vielä ole yhtään varausta.'}</p>
        )}
      </Loader>
    );
  }
}

UnconnectedReservationListContainer.propTypes = {
  emptyMessage: PropTypes.string,
  filter: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  isAdmin: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  staffUnits: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default connect(reservationListSelector)(UnconnectedReservationListContainer);
