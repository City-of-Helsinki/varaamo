import pick from 'lodash/object/pick';
import camelCase from 'lodash/string/camelCase';
import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationsList from 'components/common/CompactReservationsList';
import { RESERVATION_FORM_FIELDS } from 'constants/AppConstants';
import ReservationForm from 'containers/ReservationForm';

class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.getFormFields = this.getFormFields.bind(this);
    this.getFormInitialValues = this.getFormInitialValues.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.renderIntroTexts = this.renderIntroTexts.bind(this);
  }

  onConfirm(values) {
    const { onClose, onConfirm } = this.props;
    onClose();
    onConfirm(values);
  }

  getFormFields() {
    const { resource } = this.props;
    const isAdmin = resource.userPermissions.isAdmin;
    const formFields = [];
    if (resource.needManualConfirmation) {
      formFields.push(...RESERVATION_FORM_FIELDS);
    }

    if (isAdmin) {
      formFields.push('comments');
      if (resource.needManualConfirmation) {
        formFields.push('staffEvent');
      }
    }

    return formFields;
  }

  getFormInitialValues() {
    const {
      isEditing,
      reservationsToEdit,
      selectedReservations,
    } = this.props;
    let reservation;

    if (isEditing) {
      reservation = reservationsToEdit.length ? reservationsToEdit[0] : null;
    } else {
      reservation = selectedReservations.length ? selectedReservations[0] : null;
    }

    return reservation ? pick(reservation, ['comments', ...RESERVATION_FORM_FIELDS]) : {};
  }

  getModalTitle(isEditing, isPreliminaryReservation) {
    if (isEditing) {
      return 'Muutosten vahvistus';
    }
    if (isPreliminaryReservation) {
      return 'Alustava varaus';
    }
    return 'Varauksen vahvistus';
  }

  renderIntroTexts() {
    const {
      isEditing,
      isPreliminaryReservation,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (isEditing) {
      return (
        <div>
          <p><strong>Oletko varma että haluat muuttaa varaustasi?</strong></p>
          <p>Ennen muutoksia:</p>
          <CompactReservationsList reservations={reservationsToEdit} />
          <p>Muutosten jälkeen:</p>
          <CompactReservationsList reservations={selectedReservations} />
        </div>
      );
    }

    let helpText;

    if (isPreliminaryReservation) {
      helpText = selectedReservations.length === 1 ?
        'Olet tekemässä alustavaa varausta ajalle:' :
        'Olet tekemässä alustavaa varausta ajoille:';
    } else {
      helpText = selectedReservations.length === 1 ?
        'Oletko varma että haluat tehdä varauksen ajalle:' :
        'Oletko varma että haluat tehdä varaukset ajoille:';
    }

    return (
      <div>
        <p><strong>{helpText}</strong></p>
        <CompactReservationsList reservations={selectedReservations} />
        {isPreliminaryReservation && (
          <p>
            Täytä vielä seuraavat tiedot alustavaa varausta varten.
            Tähdellä (*) merkityt tiedot ovat pakollisia.
          </p>
        )}
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      isPreliminaryReservation,
      onClose,
      resource,
      show,
    } = this.props;

    const requiredFormFields = resource.requiredReservationExtraFields.map((field) => {
      return camelCase(field);
    });

    return (
      <Modal
        animation={false}
        className="confirm-reservation-modal"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderIntroTexts()}
          <ReservationForm
            fields={this.getFormFields()}
            initialValues={this.getFormInitialValues()}
            isMakingReservations={isMakingReservations}
            onClose={onClose}
            onConfirm={this.onConfirm}
            requiredFields={requiredFormFields}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPreliminaryReservation: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
