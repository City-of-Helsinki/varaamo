import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import { getName } from 'utils/DataUtils';

class ReservationsTableRow extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const {
      openDeleteModal,
      reservation,
      selectReservationToDelete,
    } = this.props;

    selectReservationToDelete(reservation);
    openDeleteModal();
  }

  render() {
    const {
      reservation,
      resource,
      unit,
    } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${resource.id}`}>
            {getName(resource)}
          </Link>
        </td>
        <td>{getName(unit)}</td>
        <td>
          <TimeRange begin={reservation.begin} end={reservation.end} />
        </td>
        <td>
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={this.handleDeleteClick}
          >
            Poista
          </Button>
        </td>
      </tr>
    );
  }
}

ReservationsTableRow.propTypes = {
  openDeleteModal: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ReservationsTableRow;
