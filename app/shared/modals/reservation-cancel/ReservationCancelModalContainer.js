import forEach from 'lodash/forEach';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation } from 'actions/reservationActions';
import { closeReservationCancelModal } from 'actions/uiActions';
import CompactReservationList from 'shared/compact-reservation-list';
import reservationCancelModalSelector from './reservationCancelModalSelector';

export class UnconnectedReservationCancelModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    const { actions, reservationsToCancel } = this.props;

    forEach(reservationsToCancel, (reservation) => {
      actions.deleteReservation(reservation);
    });
    actions.closeReservationCancelModal();
  }

  renderModalContent(reservations, resources, cancelAllowed, responsibleContactInfo) {
    if (cancelAllowed) {
      return (
        <div>
          {reservations.length === 1 ?
            <p><strong>Oletko varma että haluat perua seuraavan varauksen:</strong></p> :
              <p><strong>Oletko varma että haluat perua seuraavat varaukset:</strong></p>
          }
          <CompactReservationList reservations={reservations} resources={resources} />
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
          Huomioi kuitenkin, että varaus pitää perua viimeistään <strong>5 päivää</strong> ennen
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
      isCancellingReservations,
      reservationsToCancel,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToCancel.length ? reservationsToCancel[0] : null;
    const resource = reservation ? resources[reservation.resource] : {};
    const state = reservation ? reservation.state : '';
    const isPreliminaryReservation = reservation && reservation.needManualConfirmation;
    const cancelAllowed = (
      !isPreliminaryReservation ||
      isAdmin ||
      state !== 'confirmed'
    );

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
              disabled={isCancellingReservations}
              onClick={this.handleCancel}
            >
              {isCancellingReservations ? 'Perutaan...' : 'Peru varaus'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isCancellingReservations: PropTypes.bool.isRequired,
  reservationsToCancel: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModalContainer
);
