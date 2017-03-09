import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Modal from 'react-bootstrap/lib/Modal';
import { findDOMNode } from 'react-dom';

import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';

class ReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.handleSaveCommentsClick = this.handleSaveCommentsClick.bind(this);
    this.renderAddressRow = this.renderAddressRow.bind(this);
    this.renderInfoRow = this.renderInfoRow.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  handleSaveCommentsClick() {
    const comments = findDOMNode(this.refs.commentsInput).value;
    this.props.onSaveCommentsClick(comments);
  }

  renderAddressRow(addressType) {
    const { reservation, t } = this.props;
    const hasAddress = (
      reservation.reserverAddressStreet || reservation.reserverAddressStreet === ''
    );
    if (!hasAddress) return null;
    return (
      <span>
        <dt>{t(`common.${addressType}Label`)}:</dt>
        <dd>
          {this.getAddress(
            reservation[`${addressType}Street`],
            reservation[`${addressType}Zip`],
            reservation[`${addressType}City`]
          )}
        </dd>
      </span>
    );
  }

  renderInfoRow(propertyName) {
    const { reservation, t } = this.props;
    const property = reservation[propertyName];
    if (!property && property !== '') return null;
    return (
      <span>
        <dt>{t(`common.${propertyName}Label`)}:</dt>
        <dd>{property}</dd>
      </span>
    );
  }

  render() {
    const {
      hideReservationInfoModal,
      isAdmin,
      isEditingReservations,
      isStaff,
      onCancelClick,
      onConfirmClick,
      onDenyClick,
      reservation,
      reservationIsEditable,
      resource,
      show,
      t,
    } = this.props;

    const showCancelButton = reservationIsEditable && (
      reservation.state === 'confirmed' ||
      (reservation.state === 'requested' && !isAdmin)
    );

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
          {!isEmpty(reservation) &&
            <div>
              <ReservationStateLabel reservation={reservation} />
              <dl className="dl-horizontal">
                {this.renderInfoRow('eventSubject')}
                {this.renderInfoRow('reserverName')}
                {isStaff && this.renderInfoRow('reserverId')}
                {this.renderInfoRow('reserverPhoneNumber')}
                {this.renderInfoRow('reserverEmailAddress')}
                {this.renderInfoRow('eventDescription')}
                {this.renderInfoRow('numberOfParticipants')}
                {this.renderAddressRow('reserverAddress')}
                {this.renderAddressRow('billingAddress')}
                <dt>{t('ReservationInfoModal.reservationTime')}:</dt>
                <dd><TimeRange begin={reservation.begin} end={reservation.end} /></dd>
                <dt>{t('ReservationInfoModal.resource')}:</dt><dd>{resource.name}</dd>
                {reservation.accessCode && (
                  <span>
                    <dt>{t('ReservationInfoModal.accessCode')}:</dt>
                    <dd>{reservation.accessCode}</dd>
                  </span>
                )}
                {isAdmin && !reservationIsEditable && (
                  <span>
                    <dt>{t('common.commentsLabel')}:</dt>
                    <dd>{reservation.comments}</dd>
                  </span>
                )}
              </dl>
              {isAdmin && reservationIsEditable && (
                <form>
                  <FormGroup controlId="commentsTextarea">
                    <ControlLabel>{t('common.commentsLabel')}:</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      defaultValue={reservation.comments}
                      placeholder={t('common.commentsPlaceholder')}
                      ref="commentsInput"
                      rows={5}
                    />
                  </FormGroup>
                  <div className="form-controls">
                    <Button
                      bsStyle="primary"
                      disabled={isEditingReservations}
                      onClick={this.handleSaveCommentsClick}
                    >
                      {isEditingReservations ? t('common.saving') : t('ReservationInfoModal.saveComment')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
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
              disabled={isEditingReservations}
              onClick={onDenyClick}
            >
              {t('ReservationInfoModal.denyButton')}
            </Button>
          )}
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="success"
              disabled={isEditingReservations}
              onClick={onConfirmClick}
            >
              {t('ReservationInfoModal.confirmButton')}
            </Button>
          )}
          {showCancelButton && (
            <Button
              bsStyle="danger"
              disabled={isEditingReservations}
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
  isEditingReservations: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onSaveCommentsClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationInfoModal);
