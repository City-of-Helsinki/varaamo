import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import DeleteModal from 'components/reservation/DeleteModal';
import ReservationsTableRow from 'components/reservation/ReservationsTableRow';

class ReservationsTable extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsTableRow = this.renderReservationsTableRow.bind(this);
  }

  renderReservationsTableRow(reservation) {
    const {
      openDeleteModal,
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
        openDeleteModal={openDeleteModal}
        unit={unit}
      />
    );
  }

  render() {
    const {
      closeDeleteModal,
      deleteModalIsOpen,
      isDeleting,
      isFetching,
      reservations,
      reservationsToDelete,
    } = this.props;

    return (
      <Loader loaded={!isFetching}>
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
              onClose={closeDeleteModal}
              onConfirm={closeDeleteModal}
              isDeleting={isDeleting}
              reservationsToDelete={reservationsToDelete}
              show={deleteModalIsOpen}
            />
          </div>
        ) : (
          <p>Sinulla ei vielä ole yhtään varauksia.</p>
        )}
      </Loader>
    );
  }
}

ReservationsTable.propTypes = {
  closeDeleteModal: PropTypes.func.isRequired,
  deleteModalIsOpen: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  reservations: PropTypes.array.isRequired,
  reservationsToDelete: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

export default ReservationsTable;
