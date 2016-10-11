import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import {
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
} from 'actions/reservationActions';
import {
  openReservationCancelModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
} from 'actions/uiActions';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ReservationControls from './ReservationControls';

export class UnconnectedReservationControlsContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleDenyClick = this.handleDenyClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
  }

  handleCancelClick() {
    const { actions, reservation } = this.props;
    actions.selectReservationToCancel(reservation);
    actions.openReservationCancelModal();
  }

  handleConfirmClick() {
    const {
      actions,
      isAdmin,
      reservation,
    } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.confirmPreliminaryReservation(reservation);
    }
  }

  handleDenyClick() {
    const {
      actions,
      isAdmin,
      reservation,
    } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.denyPreliminaryReservation(reservation);
    }
  }

  handleEditClick() {
    const { actions, reservation, resource } = this.props;
    const nextUrl = getResourcePageUrl(resource, reservation.begin, reservation.begin);

    actions.selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    browserHistory.push(nextUrl);
  }

  handleInfoClick() {
    const { actions, reservation } = this.props;

    actions.selectReservationToShow(reservation);
    actions.openReservationInfoModal();
  }

  render() {
    const {
      isAdmin,
      isStaff,
      reservation,
    } = this.props;

    return (
      <ReservationControls
        isAdmin={isAdmin}
        isStaff={isStaff}
        onCancelClick={this.handleCancelClick}
        onConfirmClick={this.handleConfirmClick}
        onDenyClick={this.handleDenyClick}
        onEditClick={this.handleEditClick}
        onInfoClick={this.handleInfoClick}
        reservation={reservation}
      />
    );
  }
}

UnconnectedReservationControlsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
    openReservationCancelModal,
    openReservationInfoModal,
    selectReservationToCancel,
    selectReservationToEdit,
    selectReservationToShow,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(null, mapDispatchToProps)(UnconnectedReservationControlsContainer);
