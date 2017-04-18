import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';

import CompactReservationList from 'shared/compact-reservation-list';
import ReservationAccessCode from 'shared/reservation-access-code';
import { injectT } from 'i18n';
import ModalWrapper from '../ModalWrapper';

function ReservationSuccessModal({
  closeReservationSuccessModal,
  failedReservations,
  reservationsToShow,
  resources,
  show,
  t,
  user,
}) {
  const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
  const resource = reservation.resource ? resources[reservation.resource] : {};
  const isPreliminaryReservation = reservation.needManualConfirmation;
  const email = isPreliminaryReservation ? reservation.reserverEmailAddress : user.email;
  const resourceName = resource.name;
  const reservationsCount = reservationsToShow.length;

  return (
    <ModalWrapper
      className="reservation-success-modal"
      onClose={closeReservationSuccessModal}
      show={show}
      title={
        isPreliminaryReservation ?
        t('ReservationSuccessModal.preliminaryReservationTitle') :
        t('ReservationSuccessModal.regularReservationTitle')
      }
    >
      <h5>
        {isPreliminaryReservation ?
          t('ReservationSuccessModal.preliminaryReservationLead', { reservationsCount, resourceName }) :
          t('ReservationSuccessModal.regularReservationLead', { reservationsCount, resourceName })
        }
      </h5>
      <CompactReservationList reservations={reservationsToShow} />

      {Boolean(failedReservations.length) &&
        <div>
          <h5>{t('ReservationSuccessModal.failedReservationsHeader')}</h5>
          <CompactReservationList
            className="failed-reservations-list"
            reservations={failedReservations}
            subtitle="failReason"
          />
        </div>
      }

      {reservation.accessCode && (
        <div>
          <p>
            <ReservationAccessCode
              reservation={reservation}
              text={t('ReservationSuccessModal.reservationAccessCodeText')}
            />
          </p>
          <p>
            {t('ReservationSuccessModal.ownReservationsPageHelpText')}
            {email &&
              <span>
                {' '}
                <FormattedHTMLMessage
                  id="ReservationSuccessModal.emailHelpText"
                  values={{ email }}
                />
              </span>
            }.
          </p>
        </div>
      )}

      {isPreliminaryReservation && (
        <p>
          <FormattedHTMLMessage
            id="ReservationSuccessModal.preliminaryReservationInfo"
            values={{ email }}
          />
        </p>
      )}

      <div className="modal-controls">
        <Button
          bsStyle="default"
          onClick={closeReservationSuccessModal}
        >
          {t('common.ok')}
        </Button>
      </div>
    </ModalWrapper>
  );
}

ReservationSuccessModal.propTypes = {
  closeReservationSuccessModal: PropTypes.func.isRequired,
  failedReservations: PropTypes.array.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default injectT(ReservationSuccessModal);
