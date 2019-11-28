import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import injectT from '../../../../app/i18n/injectT';
import CompactReservationList from '../../../../app/shared/compact-reservation-list/CompactReservationList';

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    users: state.data.users
  };
};

const ReservationCancelModal = ({
  onEditReservation, parentToggle, reservation, toggleShow, t, userId, users
}) => {
  const [show, setShow] = useState(toggleShow);
  const [checkboxDisabled, handleCheckbox] = useState(false);
  const handleClose = () => {
    setShow(() => false);
    parentToggle(false);
  };

  /**
   * Both <root>/varaamo/app/shared/modals/reservation-cancel/ReservationCancelModalContainer.js
   * and ReservationCancelModal are using CompactReservationList to output resource name, date, etc.
   * We need to alter reservation a little bit before passing it to CompactReservationList.
   */
  const reservationCopyId = JSON.parse(JSON.stringify(reservation));
  const id = reservationCopyId.resource.id;
  reservationCopyId.resource = id;

  const reservationCopy = JSON.parse(JSON.stringify(reservation));
  const name = reservationCopy.resource.name.fi;
  reservationCopy.resource.name = name;

  useEffect(() => {
    setShow(toggleShow);
  }, [toggleShow]);

  const renderCheckBox = (notice, onConfirm) => {
    return (
      <div>
        <p><strong>{notice}</strong></p>
        <Toggle
          defaultChecked={false}
          id="checkbox"
          onChange={e => onConfirm(e.target.checked)}
        />
      </div>
    );
  };

  return (
    <Modal
      onHide={handleClose}
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('ReservationCancelModal.cancelAllowedTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <p><strong>{t('ReservationCancelModal.lead')}</strong></p>
          {reservation.resource
            && (
              <CompactReservationList
                reservations={[reservationCopyId]}
                resources={{ [reservationCopy.resource.id]: reservationCopy.resource }}
              />
            )
          }
          {
            reservation.resource
            && renderCheckBox(
              t('ReservationInformationForm.refundCheckBox'),
              () => console.log('--- FOO ---')
            )
          }
        </div>
      </Modal.Body>

      <Modal.Footer>
        Modal footer
      </Modal.Footer>
    </Modal>
  );
};

ReservationCancelModal.propTypes = {
  onEditReservation: PropTypes.func.isRequired,
  parentToggle: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  toggleShow: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(injectT(ReservationCancelModal));
