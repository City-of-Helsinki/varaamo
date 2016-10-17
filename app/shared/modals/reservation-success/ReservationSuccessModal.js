import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import CompactReservationList from 'shared/compact-reservation-list';
import { getName } from 'utils/translationUtils';
import ModalWrapper from '../ModalWrapper';

function renderEmail(email) {
  if (!email) {
    return '';
  }
  return <strong> {email}</strong>;
}

function ReservationSuccessModal({
  closeReservationSuccessModal,
  reservationsToShow,
  resources,
  show,
}) {
  const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
  const resource = reservation.resource ? resources[reservation.resource] : {};
  const isPreliminaryReservation = reservation.needManualConfirmation;

  return (
    <ModalWrapper
      className="reservation-success-modal"
      onClose={closeReservationSuccessModal}
      show={show}
      title={
        isPreliminaryReservation ? 'Varauspyyntösi on lähetetty' : 'Varauksen tekeminen onnistui'
      }
    >
      <p>
        {isPreliminaryReservation ? 'Olet tehnyt alustavan varauksen tilaan ' : 'Varaus tehty tilaan '}
        {getName(resource)}
        {reservationsToShow.length === 1 ? ' ajalle:' : ' ajoille:'}
      </p>
      <CompactReservationList reservations={reservationsToShow} />

      {isPreliminaryReservation && (
        <p>
          Varaus käsitellään kahden arkipäivän kuluessa. Tarkemmat tiedot alustavasta varauksesta
          lähetetään varauksen yhteydessä annettuun sähköpostiosoitteeseen
          {renderEmail(reservation.reserverEmailAddress)}.
        </p>
      )}

      <div className="modal-controls">
        <Button
          bsStyle="default"
          onClick={closeReservationSuccessModal}
        >
          Takaisin
        </Button>
      </div>
    </ModalWrapper>
  );
}

ReservationSuccessModal.propTypes = {
  closeReservationSuccessModal: PropTypes.func.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ReservationSuccessModal;
