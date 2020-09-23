import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  postReservation,
} from '../../actions/reservationActions';
import {
  cancelMultidayReservationCreation,
  closeCreateMultidayReservationModal,
} from '../../actions/uiActions';
import multidayReservationCreationSelector from './multidayReservationCreationSelector';
import CreateMultidayReservationModal from './CreateMultidayReservationModal';

export class UnconnectedMultidayReservationCreationContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    createMultidayReservationModalIsOpen: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    resource: PropTypes.object.isRequired,
    staffEventSelected: PropTypes.bool,
    selectedMultidaySlot: PropTypes.object,
  };

  handleReservation = (reservation) => {
    this.props.actions.postReservation(reservation);
  };

  render() {
    const {
      actions,
      createMultidayReservationModalIsOpen,
      isMakingReservations,
      isStaff,
      resource,
      staffEventSelected,
      selectedMultidaySlot,
    } = this.props;

    const isAdmin = resource.userPermissions.isAdmin;

    return (
      <CreateMultidayReservationModal
        isAdmin={isAdmin}
        isMakingReservations={isMakingReservations}
        isPreliminaryReservation={resource.needManualConfirmation}
        isStaff={isStaff}
        onCancel={actions.cancelMultidayReservationCreation}
        onClose={actions.closeCreateMultidayReservationModal}
        onConfirm={this.handleReservation}
        resource={resource}
        selectedMultidaySlot={selectedMultidaySlot}
        show={createMultidayReservationModalIsOpen}
        staffEventSelected={staffEventSelected}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    cancelMultidayReservationCreation,
    closeCreateMultidayReservationModal,
    postReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(
  multidayReservationCreationSelector,
  mapDispatchToProps,
)(UnconnectedMultidayReservationCreationContainer);
