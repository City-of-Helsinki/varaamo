import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

import injectT from '../../../../app/i18n/injectT';

const ReservationCancelModal = ({
  showOuter
}) => {
  const [show, setShow] = useState(showOuter);
  const handleClose = () => setShow(false);

  useEffect(() => {
    setShow(showOuter);
  }, [showOuter]);

  console.log('showOuter', showOuter);
  console.log('show', show);
  console.log('----------');

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
  showOuter: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationCancelModal);
