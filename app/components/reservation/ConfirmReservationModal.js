import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

export class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onConfirm() {
    const { onClose, onConfirm } = this.props;
    onConfirm();
    onClose();
  }

  renderReservation(reservation) {
    const beginMoment = moment(reservation.begin);
    const endMoment = moment(reservation.end);
    const timeString = `${beginMoment.format('LLLL')}\u2013${endMoment.format('H:mm')}`;
    const ISORangeString = `${reservation.begin}/${reservation.end}`;

    return (
      <li key={reservation.begin}>
        <time dateTime={ISORangeString}>
          {_.capitalize(timeString)}
        </time>
      </li>
    );
  }

  render() {
    const {
      isMakingReservations,
      onClose,
      selectedReservations,
      show,
    } = this.props;

    return (
      <Modal
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Varauksen varmistus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Oletko varma että haluat tehdä seuraavat varaukset?</p>
          <ul>
            {_.map(selectedReservations, this.renderReservation)}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={onClose}
          >
            Peruuta
          </Button>
          <Button
            bsStyle="primary"
            disabled={isMakingReservations}
            onClick={this.onConfirm}
          >
            {isMakingReservations ? 'Varaamassa...' : 'Varaa'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isMakingReservations: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
