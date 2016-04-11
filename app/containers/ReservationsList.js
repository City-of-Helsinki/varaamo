import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import {
  openReservationCancelModal,
  openReservationDeleteModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToDelete,
  selectReservationToEdit,
  selectReservationToShow,
} from 'actions/uiActions';
import {
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
} from 'actions/reservationActions';
import ReservationsListItem from 'components/reservation/ReservationsListItem';
import reservationsListSelector from 'selectors/containers/reservationsListSelector';

export class UnconnectedReservationsList extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsListItem = this.renderReservationsListItem.bind(this);
  }

  renderReservationsListItem(reservation) {
    const {
      actions,
      isAdmin,
      resources,
      units,
    } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationsListItem
        confirmPreliminaryReservation={actions.confirmPreliminaryReservation}
        denyPreliminaryReservation={actions.denyPreliminaryReservation}
        isAdmin={isAdmin}
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        openReservationCancelModal={actions.openReservationCancelModal}
        openReservationDeleteModal={actions.openReservationDeleteModal}
        openReservationInfoModal={actions.openReservationInfoModal}
        updatePath={actions.updatePath}
        selectReservationToCancel={actions.selectReservationToCancel}
        selectReservationToDelete={actions.selectReservationToDelete}
        selectReservationToEdit={actions.selectReservationToEdit}
        selectReservationToShow={actions.selectReservationToShow}
        unit={unit}
      />
    );
  }

  render() {
    const {
      emptyMessage,
      isFetchingReservations,
      reservations,
    } = this.props;

    return (
      <Loader loaded={!isFetchingReservations}>
        {reservations.length ? (
          <div>
            <ul className="reservations-list">
              {map(reservations, this.renderReservationsListItem)}
            </ul>
          </div>
        ) : (
          <p>{emptyMessage || 'Sinulla ei vielä ole yhtään varausta.'}</p>
        )}
      </Loader>
    );
  }
}

UnconnectedReservationsList.propTypes = {
  actions: PropTypes.object.isRequired,
  emptyMessage: PropTypes.string,
  filter: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingReservations: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
    openReservationCancelModal,
    openReservationDeleteModal,
    openReservationInfoModal,
    updatePath,
    selectReservationToCancel,
    selectReservationToDelete,
    selectReservationToEdit,
    selectReservationToShow,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationsListSelector, mapDispatchToProps)(UnconnectedReservationsList);
