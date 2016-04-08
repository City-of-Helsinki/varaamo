import forEach from 'lodash/collection/forEach';
import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cancelPreliminaryReservation } from 'actions/reservationActions';
import { closeReservationCancelModal } from 'actions/uiActions';
import TimeRange from 'components/common/TimeRange';
import reservationCancelModalSelector from 'selectors/containers/reservationCancelModalSelector';
import { getName } from 'utils/DataUtils';

export class UnconnectedReservationCancelModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderReservation = this.renderReservation.bind(this);
  }

  handleCancel() {
    const { actions, reservationsToCancel } = this.props;

    forEach(reservationsToCancel, (reservation) => {
      actions.cancelPreliminaryReservation(reservation);
    });
    actions.closeReservationCancelModal();
  }

  renderModalContent(cancelAllowed, reservationsToCancel, reservationInfo) {
    if (cancelAllowed) {
      return (
        <div>
          <p><strong>Oletko varma että haluat perua seuraavat varaukset?</strong></p>
          <ul>
            {map(reservationsToCancel, this.renderReservation)}
          </ul>
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
        <p className="reservation-info">{reservationInfo}</p>
      </div>
    );
  }

  renderReservation(reservation) {
    const resource = this.props.resources[reservation.resource] || {};
    return (
      <li key={reservation.begin}>
        {getName(resource)}
        {': '}
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
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
            {cancelAllowed ? 'Varauksen perumisen vahvistus' : 'Varauksen peruminen'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalContent(cancelAllowed, reservationsToCancel, resource.reservationInfo)}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationCancelModal}
          >
            {cancelAllowed ? 'Älä peruuta varausta' : 'Takaisin'}
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              onClick={this.handleCancel}
              >
              Peruuta varaus
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
