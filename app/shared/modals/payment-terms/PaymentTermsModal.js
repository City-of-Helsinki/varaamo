import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

import injectT from '../../../i18n/injectT';

function PaymentTermsModal({
  isOpen,
  onDismiss,
  t,
}) {
  return (
    <Modal
      className="app-PaymentTermsModal"
      onHide={onDismiss}
      show={isOpen}
    >
      <Modal.Header>
        <Modal.Title>
          TODO: Add modal title
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        TODO: Add modal body
      </Modal.Body>
    </Modal>
  );
}

PaymentTermsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(PaymentTermsModal);
