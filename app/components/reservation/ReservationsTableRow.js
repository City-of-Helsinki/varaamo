import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import { getCaption, getMainImage, getName } from 'utils/DataUtils';

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
      resource,
      selectReservationToEdit,
    } = this.props;

    selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    pushState(
      null,
      `/resources/${reservation.resource}/reservation`,
      {
        date: reservation.begin.split('T')[0],
        time: reservation.begin,
      }
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

  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=80x80`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  render() {
    const {
      reservation,
      resource,
      unit,
    } = this.props;

    return (
      <tr>
        <td style={{ height: '80px', width: '80px' }}>
          <Link to={`/resources/${resource.id}`}>
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </td>
        <td>
          <Link to={`/resources/${resource.id}`}>
            <h4>{getName(resource)}</h4>
            <div className="unit-name">{getName(unit)}</div>
          </Link>
        </td>
        <td>
          <Link
            to={`/resources/${resource.id}/reservation`}
            query={{
              date: reservation.begin.split('T')[0],
              time: reservation.begin,
            }}
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
