import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

function ModalWrapper({ children, className, footerContent, onClose, show, title }) {
  return (
    <Modal className={className} onHide={onClose} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      {footerContent && (
        <Modal.Footer>{footerContent}</Modal.Footer>
      )}
    </Modal>
  );
}

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  footerContent: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default ModalWrapper;
