import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CreateNotificationsForm from '../form/CreateNotificationsForm';

const CreateNotificationModal = (props) => {
  const {
    isOpen, onHide, selectedNotification, addElement, save, onFieldChange
  } = props;
  return (
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
        <button onClick={onHide} type="button">Close</button>
        <button onClick={save} type="button">Save</button>
      </Modal.Footer>
    </Modal>
  );
};

CreateNotificationModal.propTypes = {
  addElement: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  selectedNotification: PropTypes.object.isRequired
};

export default CreateNotificationModal;
