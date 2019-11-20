import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Modal from 'react-bootstrap/lib/Modal';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';
import ReservationCancelModal from '../reservation-cancel/ReservationCancelModalContainer';
import InfoLabel from '../../../../src/common/label/InfoLabel';
import { isStaffEvent } from '../../../utils/reservationUtils';
import ReservationEditForm from './ReservationEditForm';
import { hasProducts } from '../../../utils/resourceUtils';

class ReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.commentsInput = React.createRef();

    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.handleSaveCommentsClick = this.handleSaveCommentsClick.bind(this);
  }

  getPaymentLabelData = (reservation) => {
    switch (reservation.state) {
      case 'confirmed':
        return { labelStyle: 'success', labelText: 'payment.success' };
      case 'waiting':
        return { labelStyle: 'warning', labelText: 'payment.processing' };
      case 'rejected':
        return { labelStyle: 'danger', labelText: 'payment.failed' };
      case 'cancelled':
        return { labelStyle: 'danger', labelText: 'payment.cancelled' };
      default:
        return { labelStyle: '', labelText: '' };
    }
  };

  handleEditFormSubmit(values) {
    const { onEditFormSubmit, reservation, resource } = this.props;
    const staffEvent = isStaffEvent(reservation, resource);
    onEditFormSubmit({ ...reservation, ...values, staffEvent });
  }

  handleSaveCommentsClick() {
    const comments = this.commentsInput.value;
    this.props.onSaveCommentsClick(comments);
  }

  render() {
    const {
      hideReservationInfoModal,
      isAdmin,
      isEditing,
      isSaving,
      isStaff,
      onCancelClick,
      onCancelEditClick,
      onConfirmClick,
      onDenyClick,
      onStartEditClick,
      reservation,
      reservationIsEditable,
      resource,
      show,
      t,
    } = this.props;

    const disabled = isSaving || isEditing;
    const showCancelButton = reservationIsEditable && (
      reservation.state === 'confirmed'
      || (reservation.state === 'requested' && !isAdmin)
    );


    const { labelStyle, labelText } = this.getPaymentLabelData(reservation);
    const stateLabel = constants.RESERVATION_STATE_LABELS[reservation.state];
    return (
      <Modal
        className="reservation-info-modal"
        onHide={hideReservationInfoModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('ReservationInfoModal.title')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!isEmpty(reservation)
            && (
            <div>
              <div className="reservation-labels-wrapper">
                {hasProducts(resource)
                  && labelStyle
                  && labelText
                  && !reservation.staffEvent && (
                    <InfoLabel labelStyle={labelStyle} labelText={t(labelText)} />
                )}
                {reservation.needManualConfirmation
                  && reservation.state !== 'cancelled' && (
                    <InfoLabel labelStyle={stateLabel.labelBsStyle} labelText={t(stateLabel.labelTextId)} />
                )}
              </div>
              <ReservationEditForm
                enableReinitialize
                initialValues={reservation}
                isAdmin={isAdmin}
                isEditing={isEditing}
                isSaving={isSaving}
                isStaff={isStaff}
                onCancelEditClick={onCancelEditClick}
                onStartEditClick={onStartEditClick}
                onSubmit={this.handleEditFormSubmit}
                reservation={reservation}
                reservationIsEditable={reservationIsEditable}
                resource={resource}
              />
              {isAdmin && reservationIsEditable && (
              <form className="comments-form">
                <FormGroup controlId="commentsTextarea">
                  <ControlLabel>
                    {t('common.commentsLabel')}

:
                  </ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    defaultValue={reservation.comments}
                    disabled={disabled}
                    // eslint-disable-next-line no-return-assign
                    inputRef={ref => this.commentsInput = ref}
                    placeholder={t('common.commentsPlaceholder')}
                    rows={5}
                  />
                </FormGroup>
                <div className="form-controls">
                  <Button
                    bsStyle="primary"
                    disabled={disabled}
                    onClick={this.handleSaveCommentsClick}
                  >
                    {isSaving ? t('common.saving') : t('ReservationInfoModal.saveComment')}
                  </Button>
                </div>
              </form>
              )}
            </div>
            )
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={hideReservationInfoModal}
          >
            {t('common.back')}
          </Button>
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="danger"
              disabled={disabled}
              onClick={onDenyClick}
            >
              {t('ReservationInfoModal.denyButton')}
            </Button>
          )}
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="success"
              disabled={disabled}
              onClick={onConfirmClick}
            >
              {t('ReservationInfoModal.confirmButton')}
            </Button>
          )}
          {showCancelButton && (
            <Button
              bsStyle="danger"
              disabled={disabled}
              onClick={onCancelClick}
            >
              {t('ReservationInfoModal.cancelButton')}
            </Button>
          )}
        </Modal.Footer>
        <ReservationCancelModal />
      </Modal>
    );
  }
}

ReservationInfoModal.propTypes = {
  hideReservationInfoModal: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onCancelEditClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditFormSubmit: PropTypes.func.isRequired,
  onSaveCommentsClick: PropTypes.func.isRequired,
  onStartEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationInfoModal);
