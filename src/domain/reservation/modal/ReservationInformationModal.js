import React, { useState } from 'react';
import {
  Modal, Button, ControlLabel, FormControl,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';

import ManageReservationsStatus from '../manage/status/ManageReservationsStatus';
import injectT from '../../../../app/i18n/injectT';
import { getDateAndTime } from '../manage/list/ManageReservationsList';
import { RESERVATION_STATE } from '../../../constants/ReservationState';
import ReservationMetadata from '../information/ReservationMetadata';
import ConnectedReservationCancelModal from './ReservationCancelModal';
import { getShowRefundPolicy } from '../utils';
import ReservationInformationModalContentRow from './ReservationInformationModalContentRow';

const ReservationInformationModal = ({
  t, reservation, resource, onHide, isOpen, isAdmin, onEditClick, onEditReservation, onSaveComment,
}) => {
  const [comment, setComment] = useState(get(reservation, 'comments') || '');
  const [isReservationCancelModalOpen, toggleReservationCancelModal] = useState(false);
  const saveComment = () => onSaveComment(reservation, comment);
  const normalizedReservation = Object.assign({}, reservation, { resource: reservation.resource.id });

  const parentToggle = (bool) => {
    toggleReservationCancelModal(bool);
  };

  const renderField = (label, value) => {
    return (
      <ReservationInformationModalContentRow
        content={value}
        key={label}
        label={<span>{t(`common.${(camelCase(label))}Label`)}</span>}
      />
    );
  };

  const renderInfoRow = (label, value, rest) => {
    if (!value && value !== '') return null;

    return (
      <ReservationInformationModalContentRow
        content={value}
        label={label}
        {...rest}
      />
    );
  };

  const payerFirstName = get(reservation, 'billing_first_name', '');
  const payerLastName = get(reservation, 'billing_last_name', '');
  const payerEmail = get(reservation, 'billing_email_address', '');
  const isRequestedReservation = reservation.state === RESERVATION_STATE.REQUESTED;
  const showRefundPolicy = resource !== null && getShowRefundPolicy(isAdmin, reservation, resource);

  return (
    <Modal
      className="app-ReservationInformationModal"
      onHide={onHide}
      show={isOpen}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('ReservationInfoModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManageReservationsStatus reservation={reservation} />
        <div className="app-ReservationInformationModal__information">

          {/* Render default basic information fields */}
          <div className="app-ReservationInformationModal__information__account">
            {renderField('user_name', get(reservation, 'user.display_name', ''))}
            {renderField('user_email', get(reservation, 'user.email', ''))}
          </div>
          {payerFirstName && payerLastName && renderField('payment_name', `${payerFirstName} ${payerLastName}`)}
          {payerEmail && renderField('payment_email', payerEmail)}
          {renderField('reservation_time', getDateAndTime(reservation))}
          {renderField('resource', get(reservation, 'resource.name.fi', ''))}
          {renderField('resource', get(reservation, 'resource.name.fi', ''))}

          {/* Render reservation metadata (extra) fields */}
          <ReservationMetadata
            customField={renderField}
            reservation={reservation}
          />

          {showRefundPolicy
            && renderInfoRow(
              t('ReservationInformationForm.refundPolicyTitle'),
              <>
                {t('ReservationInformationForm.refundPolicyText.1')}
                <a href={`mailto:${t('ReservationInformationForm.refundPolicyText.2')}`}>
                  {t('ReservationInformationForm.refundPolicyText.2')}
                </a>
                {t('ReservationInformationForm.refundPolicyText.3')}
              </>,
              { id: 'refund-policy' },
            )
          }

        </div>
        <div className="app-ReservationInformationModal__edit-reservation-btn">
          <Button
            bsStyle="primary"
            onClick={() => onEditClick(reservation)}
          >
            {t('ReservationEditForm.startEdit')}
          </Button>
        </div>
        <div className="app-ReservationInformationModal__comments-section">
          <ControlLabel>
            {`${t('common.commentsLabel')}:`}
          </ControlLabel>
          <FormControl
            className="app-ReservationInformationModal__comments-field"
            componentClass="textarea"
            onChange={e => setComment(e.target.value)}
            placeholder={t('common.commentsPlaceholder')}
            rows={5}
            value={comment}
          />
          <div className="app-ReservationInformationModal__save-comment">
            <Button
              bsStyle="primary"
              onClick={saveComment}
            >
              {t('ReservationInfoModal.saveComment')}
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={onHide}
        >
          {t('common.back')}
        </Button>

        <Button
          bsStyle="default"
          onClick={() => toggleReservationCancelModal(!isReservationCancelModalOpen)}
        >
          {t('ReservationInfoModal.cancelButton')}
        </Button>

        {isRequestedReservation && (
          <>
            <Button
              bsStyle="danger"
              onClick={() => onEditReservation(normalizedReservation, RESERVATION_STATE.DENIED)}
            >
              {t('ReservationInfoModal.denyButton')}
            </Button>

            <Button
              bsStyle="success"
              onClick={() => onEditReservation(normalizedReservation, RESERVATION_STATE.CONFIRMED)}
            >
              {t('ReservationInfoModal.approveButton')}
            </Button>
          </>
        )}
      </Modal.Footer>
      <ConnectedReservationCancelModal
        onEditReservation={onEditReservation}
        parentToggle={parentToggle}
        reservation={reservation}
        toggleShow={isReservationCancelModalOpen}
      />
    </Modal>
  );
};

ReservationInformationModal.propTypes = {
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object,
  onHide: PropTypes.func,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func,
  onSaveComment: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default injectT(ReservationInformationModal);
