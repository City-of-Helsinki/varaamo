import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';

import injectT from '../../../../app/i18n/injectT';

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
  const handleClose = () => {
    setShow(() => false);
    parentToggle(false);
  };

  useEffect(() => {
    setShow(toggleShow);
  }, [toggleShow]);

  // console.log('--------------------------');         // REMOVE!!!
  // console.log(`[parent] toggleShow: ${toggleShow}`); // REMOVE!!!
  // console.log(`[child]        show: ${show}`);       // REMOVE!!!

  /**
   * TODO: Where to get cancelAllowed?
   * See: <root>/varaamo/app/shared/modals/reservation-cancel/reservationCancelModalSelector.js
   * See: <root>/varaamo/app/shared/modals/reservation-cancel/ReservationCancelModalContainer.js
   */

  console.log('reservation', reservation); // reservation CONTAINS resource but resource.products IS MISSING!!!

  console.log('isStaff', users[userId].isStaff);
  console.log('reservation.need_manual_confirmation', reservation.need_manual_confirmation);
  console.log('reservation.state', reservation.state);

  return (
    <Modal
      onHide={handleClose}
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Modal body
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
