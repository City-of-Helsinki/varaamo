import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import {
  closeDeleteReservationModal,
  openDeleteReservationModal,
  selectReservationToDelete,
  selectReservationToEdit,
} from 'actions/uiActions';
import {
  deleteReservation,
  fetchReservations,
 } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import DeleteModal from 'components/reservation/DeleteModal';
import ReservationsListItem from 'components/reservation/ReservationsListItem';
import reservationsListSelector from 'selectors/containers/reservationsListSelector';

export class UnconnectedReservationsList extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderReservationsListItem = this.renderReservationsListItem.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations();
  }

  handleDelete() {
    const { actions, reservationsToDelete } = this.props;

    _.forEach(reservationsToDelete, (reservation) => {
      actions.deleteReservation(reservation);
    });
  }

  renderReservationsListItem(reservation) {
    const {
      actions,
      resources,
      units,
    } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationsListItem
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        openDeleteModal={actions.openDeleteReservationModal}
        pushState={actions.pushState}
        selectReservationToDelete={actions.selectReservationToDelete}
        selectReservationToEdit={actions.selectReservationToEdit}
        unit={unit}
      />
    );
  }

  render() {
    const {
      actions,
      deleteReservationModalIsOpen,
      isDeletingReservations,
      isFetchingReservations,
      reservations,
      reservationsToDelete,
      resources,
    } = this.props;

    return (
      <Loader loaded={!isFetchingReservations}>
        {reservations.length ? (
          <div>
            <ul className="reservations-list">
              {_.map(reservations, this.renderReservationsListItem)}
            </ul>
            <DeleteModal
              onClose={actions.closeDeleteReservationModal}
              onConfirm={this.handleDelete}
              isDeleting={isDeletingReservations}
              reservationsToDelete={reservationsToDelete}
              resources={resources}
              show={deleteReservationModalIsOpen}
            />
          </div>
        ) : (
          <p>Sinulla ei vielä ole yhtään varausta.</p>
        )}
      </Loader>
    );
  }
}

UnconnectedReservationsList.propTypes = {
  actions: PropTypes.object.isRequired,
  deleteReservationModalIsOpen: PropTypes.bool.isRequired,
  isDeletingReservations: PropTypes.bool.isRequired,
  isFetchingReservations: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  reservationsToDelete: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeDeleteReservationModal,
    deleteReservation,
    fetchReservations,
    fetchResources,
    fetchUnits,
    openDeleteReservationModal,
    pushState,
    selectReservationToDelete,
    selectReservationToEdit,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationsListSelector, mapDispatchToProps)(UnconnectedReservationsList);
