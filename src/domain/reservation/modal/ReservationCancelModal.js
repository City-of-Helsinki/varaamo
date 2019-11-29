import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../../../app/i18n/injectT';
import CompactReservationList from '../../../../app/shared/compact-reservation-list/CompactReservationList';
import { RESERVATION_STATE } from '../../../constants/ReservationState';

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
  /**
   * Until we have billable information in resource data the checkbox disabled is false. See below...
   */
  const [checkboxDisabled, disableCheckbox] = useState(false);
  /**
   * We need a way to distinguish between billable and free resources.
   * Until that it implemented in respa we ENABLE checkbox (see above...) and set billable to false.
   */
  const [billable, setBillable] = useState(false);
  const handleClose = () => {
    setShow(() => false);
    parentToggle(false);
    // Remove comment when billable information in implemented in respa. See above...
    // disableCheckbox(true);
  };

  /**
   * Both <root>/varaamo/app/shared/modals/reservation-cancel/ReservationCancelModalContainer.js
   * and ReservationCancelModal are using CompactReservationList to output resource name, date, etc.
   * We need to alter reservation a little bit before passing it to CompactReservationList.
   */

  const reservationCopyId = JSON.parse(JSON.stringify(reservation));
  const id = reservationCopyId.resource.id;
  reservationCopyId.resource = id;

  /**
   * Reservation props passed from ManageReservationsPage
   * is slightly different than reservation props
   * passed from ReservationInformationModal.
   * E.g. resource is a string instead of { name = 'Foo' }
   */

  const reservationCopy = JSON.parse(JSON.stringify(reservation));
  if (reservationCopy.resource.name) {
    const name = reservationCopy.resource.name.fi;
    reservationCopy.resource.name = name;
  } else {
    delete reservationCopy.resource;
    reservationCopy.resource = { name: '' };
  }

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

  const handleCancel = () => {
    onEditReservation(reservation, RESERVATION_STATE.CANCELLED);
  };

  return (
    <Modal
      onHide={handleClose}
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t('ReservationCancelModal.cancelAllowedTitle')}
        </Modal.Title>
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
            && billable
            && renderCheckBox(
              t('ReservationInformationForm.refundCheckBox'),
              () => {
                disableCheckbox(!checkboxDisabled);
              }
            )
          }
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          bsStyle="default"
          onClick={handleClose}
        >
          {t('ReservationCancelModal.cancelAllowedCancel')}
        </Button>
        <Button
          bsStyle="danger"
          disabled={checkboxDisabled}
          onClick={handleCancel}
        >
          {t('ReservationCancelModal.cancelAllowedConfirm')}
        </Button>
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
