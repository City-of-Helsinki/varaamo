import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationSuccessModal } from 'actions/uiActions';
import CompactReservationsList from 'components/common/CompactReservationsList';
import reservationSuccessModalSelector from 'selectors/containers/reservationSuccessModalSelector';

export class UnconnectedReservationSuccessModal extends Component {
  render() {
    const {
      actions,
      reservationsToShow,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
    const resource = reservation.resource ? resources[reservation.resource] : {};

    return (
      <Modal
        className="reservation-success-modal"
        onHide={actions.closeReservationSuccessModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Varauspyyntösi on lähetetty</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Olet tehnyt alustavan varauksen tilaan</p>
          <CompactReservationsList reservations={reservationsToShow} resources={resources} />
          <p>
            Varaus käsitellään kahden arkipäivän kuluessa. Tarkemmat tiedot alustavasta varauksesta
            lähetetään varauksen yhteydessä annettuun sähköpostiosoitteeseen
            {reservation.reserverEmailAddress ? ` ${reservation.reserverEmailAddress}` : ''}.
          </p>
          {resource.responsibleContactInfo && (
            <p>Tilasta vastaa:</p>
            `${resource.responsibleContactInfo}`
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationSuccessModal}
          >
            Takaisin
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationSuccessModal.propTypes = {
  actions: PropTypes.object.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationSuccessModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationSuccessModalSelector, mapDispatchToProps)(
  UnconnectedReservationSuccessModal
);
