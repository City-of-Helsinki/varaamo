import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import { getName } from 'utils/DataUtils';

class ReservationsTableRow extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
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

  handleEditClick() {
    const {
      pushState,
      reservation,
      selectReservationToEdit,
    } = this.props;

    selectReservationToEdit(reservation);
    pushState(
      null,
      `/resources/${reservation.resource}/reservation`,
      { date: reservation.begin.split('T')[0] }
    );
  }

  renderButtons() {
    if (moment() > moment(this.props.reservation.end)) {
      return null;
    }

    return (
      <div>
        <Button
          bsSize="xsmall"
          bsStyle="primary"
          onClick={this.handleEditClick}
        >
          Muokkaa
        </Button>
        <Button
          bsSize="xsmall"
          bsStyle="danger"
          onClick={this.handleDeleteClick}
        >
          Poista
        </Button>
      </div>
    );
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
          <div>{getName(unit)}</div>
        </td>
        <td>
          <Link
            to={`/resources/${resource.id}/reservation`}
            query={{ date: reservation.begin.split('T')[0] }}
          >
            <TimeRange
              begin={reservation.begin}
              end={reservation.end}
              lineBreaks
            />
        </Link>
        </td>
        <td>
          {this.renderButtons()}
        </td>
      </tr>
    );
  }
}

ReservationsTableRow.propTypes = {
  openDeleteModal: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  selectReservationToEdit: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ReservationsTableRow;
