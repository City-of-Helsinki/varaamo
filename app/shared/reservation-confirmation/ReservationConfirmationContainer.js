import includes from 'lodash/includes';
import forEach from 'lodash/forEach';
import tail from 'lodash/tail';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation, postReservation, putReservation } from 'actions/reservationActions';
import { closeConfirmReservationModal, openConfirmReservationModal } from 'actions/uiActions';
import ConfirmReservationModal from './ConfirmReservationModal';
import reservationConfirmationSelector from './reservationConfirmationSelector';

export class UnconnectedReservationConfirmationContainer extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleReservation = this.handleReservation.bind(this);
  }

  handleEdit(values = {}) {
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

  handleReservation(values = {}) {
    const { actions, selectedReservations } = this.props;

    selectedReservations.forEach((reservation) => {
      actions.postReservation(
        Object.assign({}, reservation, values)
      );
    });
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      isMakingReservations,
      reservationsToEdit,
      resource,
      selectedReservations,
      staffEventSelected,
      staffUnits,
    } = this.props;

    const isAdmin = resource.userPermissions.isAdmin;
    const isEditing = Boolean(reservationsToEdit.length);
    const isStaff = includes(staffUnits, resource.unit);

    return (
      <ConfirmReservationModal
        isAdmin={isAdmin}
        isEditing={isEditing}
        isMakingReservations={isMakingReservations}
        isPreliminaryReservation={resource.needManualConfirmation}
        isStaff={isStaff}
        onClose={actions.closeConfirmReservationModal}
        onConfirm={isEditing ? this.handleEdit : this.handleReservation}
        reservationsToEdit={reservationsToEdit}
        resource={resource}
        selectedReservations={selectedReservations}
        show={confirmReservationModalIsOpen}
        staffEventSelected={staffEventSelected}
      />
    );
  }
}

UnconnectedReservationConfirmationContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  confirmReservationModalIsOpen: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
  }).isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  staffEventSelected: PropTypes.bool,
  staffUnits: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    postReservation,
    putReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationConfirmationSelector, mapDispatchToProps)(
  UnconnectedReservationConfirmationContainer
);
