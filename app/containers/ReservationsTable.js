import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  closeDeleteReservationModal,
  openDeleteReservationModal,
} from 'actions/uiActions';
import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import DeleteModal from 'components/reservation/DeleteModal';
import ReservationsTableRow from 'components/reservation/ReservationsTableRow';
import reservationsTableSelector from 'selectors/containers/reservationsTableSelector';

export class UnconnectedReservationsTable extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsTableRow = this.renderReservationsTableRow.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations();
  }

  renderReservationsTableRow(reservation) {
    const {
      actions,
      resources,
      units,
    } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationsTableRow
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        openDeleteModal={actions.openDeleteReservationModal}
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
    } = this.props;

    return (
      <Loader loaded={!isFetchingReservations}>
        {reservations.length ? (
          <div>
            <Table striped>
              <thead>
                <tr>
                  <th>Tila</th>
                  <th>Sijainti</th>
                  <th>Aika</th>
                  <th>Toiminnot</th>
                </tr>
              </thead>
              <tbody>
                {_.map(reservations, this.renderReservationsTableRow)}
              </tbody>
            </Table>
            <DeleteModal
              onClose={actions.closeDeleteReservationModal}
              onConfirm={actions.closeDeleteReservationModal}
              isDeleting={isDeletingReservations}
              reservationsToDelete={[]}
              show={deleteReservationModalIsOpen}
            />
          </div>
        ) : (
          <p>Sinulla ei vielä ole yhtään varauksia.</p>
        )}
      </Loader>
    );
  }
}

UnconnectedReservationsTable.propTypes = {
  actions: PropTypes.object.isRequired,
  deleteReservationModalIsOpen: PropTypes.bool.isRequired,
  isDeletingReservations: PropTypes.bool.isRequired,
  isFetchingReservations: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeDeleteReservationModal,
    fetchReservations,
    fetchResources,
    fetchUnits,
    openDeleteReservationModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationsTableSelector, mapDispatchToProps)(UnconnectedReservationsTable);
