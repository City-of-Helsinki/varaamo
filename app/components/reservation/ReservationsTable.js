import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import ReservationsTableRow from 'components/reservation/ReservationsTableRow';

class ReservationsTable extends Component {
  constructor(props) {
    super(props);
    this.renderReservationsTableRow = this.renderReservationsTableRow.bind(this);
  }

  renderReservationsTableRow(reservation) {
    const { resources, units } = this.props;
    const resource = resources[reservation.resource] || {};
    const unit = resource.unit ? units[resource.unit] || {} : {};

    return (
      <ReservationsTableRow
        key={reservation.url}
        reservation={reservation}
        resource={resource}
        unit={unit}
      />
    );
  }

  render() {
    const { isFetching, reservations } = this.props;

    return (
      <Loader loaded={!isFetching}>
        {reservations.length ? (
          <Table striped>
            <thead>
              <tr>
                <th>Tila</th>
                <th>Sijainti</th>
                <th>Aika</th>
              </tr>
            </thead>
            <tbody>
              {_.map(reservations, this.renderReservationsTableRow)}
            </tbody>
          </Table>
        ) : (
          <p>Sinulla ei vielä ole yhtään varauksia.</p>
        )}
      </Loader>
    );
  }
}

ReservationsTable.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

export default ReservationsTable;
