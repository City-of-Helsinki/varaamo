import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

import TimeRange from 'components/common/TimeRange';

class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
    this.renderModalBody = this.renderModalBody.bind(this);
  }

  onConfirm() {
    const { onClose, onConfirm } = this.props;
    onClose();
    onConfirm();
  }

  renderModalBody() {
    const { isEditing, reservationsToEdit, selectedReservations } = this.props;

    if (isEditing) {
      return (
        <div>
          <p><strong>Oletko varma että haluat muuttaa varaustasi?</strong></p>
          <p>Ennen muutoksia:</p>
          <ul>
            {_.map(reservationsToEdit, this.renderReservation)}
          </ul>
          <p>Muutosten jälkeen:</p>
          <ul>
            {_.map(selectedReservations, this.renderReservation)}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <p><strong>Oletko varma että haluat tehdä seuraavat varaukset?</strong></p>
        <ul>
          {_.map(selectedReservations, this.renderReservation)}
        </ul>
      </div>
    );
  }

  renderReservation(reservation) {
    return (
      <li key={reservation.begin}>
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onClose,
      show,
    } = this.props;

    return (
      <Modal
        animation={false}
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Muutosten vahvistus' : 'Varauksen vahvistus'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalBody()}
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
            {isMakingReservations ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
