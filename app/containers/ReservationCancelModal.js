import forEach from 'lodash/collection/forEach';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cancelPreliminaryReservation } from 'actions/reservationActions';
import { closeReservationCancelModal } from 'actions/uiActions';
import CompactReservationsList from 'components/common/CompactReservationsList';
import reservationCancelModalSelector from 'selectors/containers/reservationCancelModalSelector';

export class UnconnectedReservationCancelModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    const { actions, reservationsToCancel } = this.props;

    forEach(reservationsToCancel, (reservation) => {
      actions.cancelPreliminaryReservation(reservation);
    });
    actions.closeReservationCancelModal();
  }

  renderModalContent(reservations, resources, cancelAllowed, responsibleContactInfo) {
    if (cancelAllowed) {
      return (
        <div>
          <p><strong>Oletko varma että haluat perua seuraavat varaukset?</strong></p>
          <CompactReservationsList reservations={reservations} resources={resources} />
        </div>
      );
    }

    return (
      <div>
        <p>
          Varauksen peruminen täytyy tehdä tilasta vastaavan virkailijan kautta.
          Mikäli haluat perua varauksen tai tehdä muutoksia varausaikaan ole yhteydessä tilasta
          vastaavaan virkailijaan.
        </p>
        <p>
          Huomioi kuitenkin, että varaus pitää perua viimeistään <strong>X päivää</strong> ennen
          varauksen alkamista. Käyttämättömät varaukset laskutetaan.
        </p>
        <p className="responsible-contact-info">{responsibleContactInfo}</p>
      </div>
    );
  }

  render() {
    const {
      actions,
      isAdmin,
      reservationsToCancel,
      resources,
      show,
    } = this.props;

    const resource = reservationsToCancel.length ? resources[reservationsToCancel[0].resource] : {};
    const state = reservationsToCancel.length ? reservationsToCancel[0].state : '';
    const cancelAllowed = isAdmin || state !== 'confirmed';

    return (
      <Modal
        onHide={actions.closeReservationCancelModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {cancelAllowed ? 'Perumisen vahvistus' : 'Varauksen peruminen'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalContent(
            reservationsToCancel, resources, cancelAllowed, resource.responsibleContactInfo
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationCancelModal}
          >
            {cancelAllowed ? 'Älä peru varausta' : 'Takaisin'}
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              onClick={this.handleCancel}
              >
              Peru varaus
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModal.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  reservationsToCancel: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    cancelPreliminaryReservation,
    closeReservationCancelModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModal
);
