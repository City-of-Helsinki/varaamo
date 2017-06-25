import forEach from 'lodash/forEach';
import tail from 'lodash/tail';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation, postReservation, putReservation } from 'actions/reservationActions';
import { closeConfirmReservationModal, openConfirmReservationModal } from 'actions/uiActions';
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
  };

  handleEdit = (values = {}) => {
    const {
      actions,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (selectedReservations.length) {
      // Edit the first selected reservation.
      actions.putReservation(Object.assign(
        {},
        selectedReservations[0],
        values,
        { url: reservationsToEdit[0].url }
      ));

      // Add new reservations if needed.
      // FIXME: This is very hacky and not bulletproof but use cases where user splits
      // one reservation into multiple reservations should be pretty rare.
      // Try to use something sequential in the future.
      // Use timeout to allow the PUT request to go through first and possibly free previously
      // reserved time slots.
      setTimeout(() => {
        forEach(tail(selectedReservations), (reservation) => {
          actions.postReservation(
            Object.assign({}, reservation, values)
          );
        });
      }, 800);
    } else {
      // Delete the edited reservation if no time slots were selected.
      forEach(reservationsToEdit, (reservation) => {
        actions.deleteReservation(reservation);
      });
    }
  }

  handleReservation = (values = {}) => {
    const { actions, recurringReservations, resource, selectedReservations } = this.props;

    [...selectedReservations, ...recurringReservations].forEach((reservation) => {
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
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
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
