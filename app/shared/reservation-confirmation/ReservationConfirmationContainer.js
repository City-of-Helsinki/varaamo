import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { first, last, orderBy } from 'lodash';

import { deleteReservation, postReservation, putReservation } from 'actions/reservationActions';
import {
  cancelReservationEdit,
  closeConfirmReservationModal,
  openConfirmReservationModal,
} from 'actions/uiActions';
import recurringReservationsConnector from 'state/recurringReservations';
import ConfirmReservationModal from './ConfirmReservationModal';
import reservationConfirmationSelector from './reservationConfirmationSelector';

export class UnconnectedReservationConfirmationContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    confirmReservationModalIsOpen: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
      id: PropTypes.string.isRequired,
    }).isRequired,
    recurringReservations: PropTypes.array.isRequired,
    reservationsToEdit: PropTypes.array.isRequired,
    resource: PropTypes.object.isRequired,
    showTimeControls: PropTypes.bool,
    selectedReservations: PropTypes.array.isRequired,
    staffEventSelected: PropTypes.bool,
    timeSlots: PropTypes.array,
  };

  handleEdit = (values = {}) => {
    const { actions, reservationsToEdit } = this.props;
    actions.putReservation({
      ...reservationsToEdit[0],
      ...values,
    });
  }

  handleReservation = (values = {}) => {
    const { actions, recurringReservations, resource, selectedReservations } = this.props;
    const orderedReservations = orderBy(selectedReservations, 'begin');
    const selectedReservation = Object.assign({}, first(orderedReservations));
    selectedReservation.end = last(orderedReservations).end;
    const mergedReservations = [selectedReservation];

    [...mergedReservations, ...recurringReservations].forEach((reservation) => {
      actions.postReservation({
        ...reservation,
        ...values,
        resource: resource.id,
      });
    });
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      isMakingReservations,
      isStaff,
      recurringReservations,
      reservationsToEdit,
      resource,
      selectedReservations,
      showTimeControls,
      staffEventSelected,
      timeSlots,
    } = this.props;

    const isAdmin = resource.userPermissions.isAdmin;
    const isEditing = Boolean(reservationsToEdit.length);

    return (
      <ConfirmReservationModal
        isAdmin={isAdmin}
        isEditing={isEditing}
        isMakingReservations={isMakingReservations}
        isPreliminaryReservation={resource.needManualConfirmation}
        isStaff={isStaff}
        onCancel={actions.cancelReservationEdit}
        onClose={actions.closeConfirmReservationModal}
        onConfirm={isEditing ? this.handleEdit : this.handleReservation}
        onRemoveReservation={actions.removeReservation}
        recurringReservations={recurringReservations}
        reservationsToEdit={reservationsToEdit}
        resource={resource}
        selectedReservations={selectedReservations}
        show={confirmReservationModalIsOpen}
        showTimeControls={showTimeControls}
        staffEventSelected={staffEventSelected}
        timeSlots={timeSlots}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    cancelReservationEdit,
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    postReservation,
    putReservation,
    removeReservation: recurringReservationsConnector.removeReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationConfirmationSelector, mapDispatchToProps)(
  UnconnectedReservationConfirmationContainer
);
