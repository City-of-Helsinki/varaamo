import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import CompactReservationList from 'shared/compact-reservation-list';
import ReservationAccessCode from 'shared/reservation-access-code';
import { getName } from 'utils/translationUtils';
import ModalWrapper from '../ModalWrapper';

function ReservationSuccessModal({
  closeReservationSuccessModal,
  reservationsToShow,
  resources,
  show,
  user,
}) {
  const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
  const resource = reservation.resource ? resources[reservation.resource] : {};
  const isPreliminaryReservation = reservation.needManualConfirmation;
  const email = isPreliminaryReservation ? reservation.reserverEmailAddress : user.email;

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

      {reservation.accessCode && (
        <div>
          <p>
            <ReservationAccessCode
              reservation={reservation}
              text="Tilaan pääset käyttämällä PIN-koodia:"
            />
          </p>
          <p>
            PIN-koodin voit tarkistaa jatkossa {'"Omat varaukset" -sivulta'}
            {email ? ' sekä varausvahvistuksesta, joka on lähetetty sähköpostiosoitteeseen: ' : ''}
            {email && <strong>{email}</strong>}.
          </p>
        </div>
      )}

      {isPreliminaryReservation && (
        <p>
          Varaus käsitellään kahden arkipäivän kuluessa. Tarkemmat tiedot alustavasta varauksesta
          lähetetään varauksen yhteydessä annettuun sähköpostiosoitteeseen
          {email && <strong> {email}</strong>}.
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
  user: PropTypes.object.isRequired,
};

export default ReservationSuccessModal;
