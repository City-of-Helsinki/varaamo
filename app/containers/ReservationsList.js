import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import {
  openReservationCancelModal,
  openReservationDeleteModal,
  selectReservationToCancel,
  selectReservationToDelete,
  selectReservationToEdit,
} from 'actions/uiActions';
import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationCancelModal from 'containers/ReservationCancelModal';
import ReservationDeleteModal from 'containers/ReservationDeleteModal';
import ReservationsListItem from 'components/reservation/ReservationsListItem';
import reservationsListSelector from 'selectors/containers/reservationsListSelector';

export class UnconnectedReservationsList extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsListItem = this.renderReservationsListItem.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({ isOwn: true });
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
        openReservationCancelModal={actions.openReservationCancelModal}
        openReservationDeleteModal={actions.openReservationDeleteModal}
        updatePath={actions.updatePath}
        selectReservationToCancel={actions.selectReservationToCancel}
        selectReservationToDelete={actions.selectReservationToDelete}
        selectReservationToEdit={actions.selectReservationToEdit}
        unit={unit}
      />
    );
  }

  render() {
    const {
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
            <ReservationCancelModal />
            <ReservationDeleteModal />
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
  isFetchingReservations: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchReservations,
    fetchResources,
    fetchUnits,
    openReservationCancelModal,
    openReservationDeleteModal,
    updatePath,
    selectReservationToCancel,
    selectReservationToDelete,
    selectReservationToEdit,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationsListSelector, mapDispatchToProps)(UnconnectedReservationsList);
