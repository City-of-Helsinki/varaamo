import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const DeleteConfirmationDialog = (props) => {
  const { isOpen, onHide, deleteConfirm } = props;
  return (
    <Modal
      className="app-CreateNotificationModal"
      onHide={onHide}
      show={isOpen}
    >
      <Modal.Header>
        <Modal.Title>Delete notification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure you want to delete this notification?</span>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button onClick={onHide} type="button">Cancel</button>
        <button onClick={deleteConfirm} type="button">Delete</button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  deleteConfirm: PropTypes.func.isRequired
};

export default DeleteConfirmationDialog;
