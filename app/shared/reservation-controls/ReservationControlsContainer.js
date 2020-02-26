import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import camelCaseKeys from 'camelcase-keys';

import {
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
} from '../../actions/reservationActions';
import {
  openConfirmReservationModal,
  openReservationCancelModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
  showReservationInfoModal,
  startReservationEditInInfoModal,
} from '../../actions/uiActions';
import { getEditReservationUrl } from '../../utils/reservationUtils';
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

  // This component may send the reservation it receives as a prop into
  // redux state. The reservation prop this component receives may be in
  // snake_case. To ensure that we do not send a snake_cased object into
  // redux state, we are camelCasing the reservation object here.
  get reservation() {
    return camelCaseKeys(this.props.reservation);
  }

  handleCancelClick() {
    const { actions } = this.props;
    actions.selectReservationToCancel(this.reservation);
    actions.openReservationCancelModal();
  }

  handleConfirmClick() {
    const { actions, isAdmin } = this.props;

    if (isAdmin && this.reservation.state === 'requested') {
      actions.confirmPreliminaryReservation(this.reservation);
    }
  }

  handleDenyClick() {
    const { actions, isAdmin } = this.props;

    if (isAdmin && this.reservation.state === 'requested') {
      actions.denyPreliminaryReservation(this.reservation);
    }
  }

  handleEditClick() {
    const {
      actions, resource, history,
    } = this.props;

    if (!resource === null) {
      return;
    }

    const nextUrl = getEditReservationUrl(this.reservation);

    actions.selectReservationToEdit({ reservation: this.reservation, slotSize: resource.slot_size });
    history.push(nextUrl);
  }

  handleInfoClick() {
    const { actions } = this.props;

    actions.showReservationInfoModal(this.reservation);
  }

  render() {
    const {
      isAdmin,
      reservation,
      resource,
    } = this.props;


    return (
      <ReservationControls
        isAdmin={isAdmin}
        onCancelClick={this.handleCancelClick}
        onConfirmClick={this.handleConfirmClick}
        onDenyClick={this.handleDenyClick}
        onEditClick={this.handleEditClick}
        onInfoClick={this.handleInfoClick}
        reservation={reservation}
        resource={resource}
      />
    );
  }
}

UnconnectedReservationControlsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object,
  history: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
    openConfirmReservationModal,
    openReservationCancelModal,
    selectReservationToCancel,
    selectReservationToEdit,
    selectReservationToShow,
    showReservationInfoModal,
    startReservationEditInInfoModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(UnconnectedReservationControlsContainer),
);
