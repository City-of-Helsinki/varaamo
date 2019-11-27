import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

import injectT from '../../../../app/i18n/injectT';

const ReservationCancelModal = ({
  toggleShow, parentCallback
}) => {
  const [show, setShow] = useState(toggleShow);
  const handleClose = () => {
    setShow(() => false);
    parentCallback(false);
  };

  useEffect(() => {
    setShow(toggleShow);
  }, [toggleShow]);

  console.log('--------------------------');
  console.log(`[parent] toggleShow: ${toggleShow}`);
  console.log(`[child]        show: ${show}`);

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
  toggleShow: PropTypes.bool.isRequired,
  parentCallback: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationCancelModal);
