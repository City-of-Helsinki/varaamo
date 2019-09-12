import React, { useState } from 'react';
import {
  Modal, Row, Col, Button, ControlLabel, FormControl
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import ManageReservationsStatus from '../manage/status/ManageReservationsStatus';
import injectT from '../../../../app/i18n/injectT';
import { getDateAndTime } from '../manage/list/ManageReservationsList';
import { RESERVATION_STATE } from '../../../constants/ReservationState';
import * as reservationUtils from '../utils';

const ReservationInformationModal = ({
  t, reservation, onHide, isOpen, onEditClick, onEditReservation, onSaveComment
}) => {
  const canUserModify = reservationUtils.canUserModifyReservation(reservation);
  const canUserCancel = reservationUtils.canUserCancelReservation(reservation);

  const [comment, setComment] = useState(get(reservation, 'comments') || '');
  const saveComment = () => onSaveComment(reservation, comment);

  const renderField = (label, value) => {
    return (
      <div className="app-ReservationInformationModal__field">
        <Row>
          <Col className="app-ReservationInformationModal__field__label" xs={5}><span>{t(label)}</span></Col>
          <Col className="app-ReservationInformationModal__field__value" xs={7}><span>{value}</span></Col>
        </Row>
      </div>
    );
  };
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
          <div className="app-ReservationInformationModal__information__account">
            {renderField('common.userNameLabel', get(reservation, 'user.display_name', ''))}
            {renderField('common.userEmailLabel', get(reservation, 'user.email', ''))}
          </div>
          {renderField('common.reserverNameLabel', get(reservation, 'reserver_name', ''))}
          {renderField('common.eventDescriptionLabel', get(reservation, 'event_description', ''))}
          {renderField('common.reservationTimeLabel', getDateAndTime(reservation))}
          {renderField('common.resourceLabel', get(reservation, 'resource.name.fi', ''))}
          {renderField('common.reserverPhoneNumberLabel', get(reservation, 'reserver_phone_number', ''))}
        </div>
        <div className="app-ReservationInformationModal__edit-reservation-btn">
          <Button
            bsStyle="primary"
            disabled={!canUserModify}
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
            onChange={e => canUserModify && setComment(e.target.value)}
            placeholder={t('common.commentsPlaceholder')}
            rows={5}
            value={comment}
          />
          <div className="app-ReservationInformationModal__save-comment">
            <Button
              bsStyle="primary"
              disabled={!canUserModify}
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
          disabled={!canUserCancel}
          onClick={() => onEditReservation(reservation, RESERVATION_STATE.CANCELLED)}
        >
          {t('ReservationInfoModal.cancelButton')}
        </Button>

        <Button
          bsStyle="danger"
          disabled={!canUserModify}
          onClick={() => onEditReservation(reservation, RESERVATION_STATE.DENIED)}
        >
          {t('ReservationInfoModal.denyButton')}
        </Button>

        <Button
          bsStyle="success"
          disabled={!canUserModify}
          onClick={() => onEditReservation(reservation, RESERVATION_STATE.CONFIRMED)}
        >
          {t('ReservationInfoModal.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ReservationInformationModal.propTypes = {
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  onHide: PropTypes.func,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func,
  onSaveComment: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

export default injectT(ReservationInformationModal);
