import pick from 'lodash/pick';
import camelCase from 'lodash/camelCase';
import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import constants from 'constants/AppConstants';
import CompactReservationList from 'shared/compact-reservation-list';
import { injectT } from 'i18n';
import { isStaffEvent } from 'utils/reservationUtils';
import { getTermsAndConditions } from 'utils/resourceUtils';
import ReservationForm from './ReservationForm';

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

  getFormFields(termsAndConditions) {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [];

    if (resource.needManualConfirmation) {
      formFields.push(...constants.RESERVATION_FORM_FIELDS);
    }

    if (isAdmin) {
      formFields.push('comments');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    return formFields;
  }

  getFormInitialValues() {
    const {
      isEditing,
      reservationsToEdit,
      resource,
      selectedReservations,
    } = this.props;
    let reservation;

    if (isEditing) {
      reservation = reservationsToEdit.length ? reservationsToEdit[0] : null;
    } else {
      reservation = selectedReservations.length ? selectedReservations[0] : null;
    }

    let rv = reservation ?
      pick(reservation, ['comments', ...constants.RESERVATION_FORM_FIELDS]) :
      {};
    if (isEditing) {
      rv = Object.assign(rv, { staffEvent: isStaffEvent(reservation, resource) });
    }
    return rv;
  }

  getModalTitle(isEditing, isPreliminaryReservation, t) {
    if (isEditing) {
      return t('ConfirmReservationModal.editTitle');
    }
    if (isPreliminaryReservation) {
      return t('ConfirmReservationModal.preliminaryReservationTitle');
    }
    return t('ConfirmReservationModal.regularReservationTitle');
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    return requiredFormFields;
  }

  renderIntroTexts() {
    const {
      isEditing,
      isPreliminaryReservation,
      reservationsToEdit,
      selectedReservations,
      t,
    } = this.props;

    if (isEditing) {
      return (
        <div>
          <p>
            <strong>{t('ConfirmReservationModal.confirmationText')}</strong>
          </p>
          <p>
            {t('ConfirmReservationModal.beforeText')}
          </p>
          <CompactReservationList reservations={reservationsToEdit} />
          <p>
            {t('ConfirmReservationModal.afterText')}
          </p>
          <CompactReservationList reservations={selectedReservations} />
        </div>
      );
    }

    const reservationsCount = selectedReservations.length;
    const helpText = isPreliminaryReservation ?
      t('ConfirmReservationModal.preliminaryReservationText', { reservationsCount }) :
      t('ConfirmReservationModal.regularReservationText', { reservationsCount });

    return (
      <div>
        <p><strong>{helpText}</strong></p>
        <CompactReservationList reservations={selectedReservations} />
        {isPreliminaryReservation && (
          <div>
            <p>{t('ConfirmReservationModal.priceInfo')}</p>
            <p>{t('ConfirmReservationModal.formInfo')}</p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      isAdmin,
      isEditing,
      isMakingReservations,
      isPreliminaryReservation,
      onClose,
      resource,
      show,
      staffEventSelected,
      t,
    } = this.props;

    const termsAndConditions = isAdmin ? '' : getTermsAndConditions(resource);

    return (
      <Modal
        animation={false}
        backdrop="static"
        className="confirm-reservation-modal"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation, t)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderIntroTexts()}
          <ReservationForm
            fields={this.getFormFields(termsAndConditions)}
            initialValues={this.getFormInitialValues()}
            isMakingReservations={isMakingReservations}
            onClose={onClose}
            onConfirm={this.onConfirm}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
            staffEventSelected={staffEventSelected}
            termsAndConditions={termsAndConditions}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPreliminaryReservation: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default injectT(ConfirmReservationModal);
