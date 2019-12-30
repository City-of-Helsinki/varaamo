import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CreateNotificationsForm from '../form/CreateNotificationsForm';
import DeleteConfirmationDialog from './DeleteConfirmationModal';

const CreateNotificationModal = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    isOpen, onHide, selectedNotification, addElement, save, onDelete, onFieldChange
  } = props;

  const deleteConfirm = () => {
    setDeleteModal(false);
    onDelete();
  };

  return (
    <React.Fragment>
      <Modal
        className="app-CreateNotificationModal"
        onHide={onHide}
        show={isOpen}
      >
        <Modal.Header>
          <Modal.Title>Edit notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container">
            <CreateNotificationsForm
              addElement={addElement}
              addNew={save}
              isEditing
              newNotification={selectedNotification}
              onFieldChange={onFieldChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button onClick={() => setDeleteModal(true)} type="button">Delete</button>
          <button onClick={onHide} type="button">Close</button>
          <button onClick={save} type="button">Save</button>
        </Modal.Footer>
      </Modal>

      <DeleteConfirmationDialog
        deleteConfirm={deleteConfirm}
        isOpen={deleteModal}
        onHide={() => setDeleteModal(false)}
      />
    </React.Fragment>

  );
};

CreateNotificationModal.propTypes = {
  addElement: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedNotification: PropTypes.object.isRequired
};

export default CreateNotificationModal;
