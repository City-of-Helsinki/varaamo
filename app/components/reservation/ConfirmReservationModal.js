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

  render() {
    const {
      isMakingReservations,
      onClose,
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
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
