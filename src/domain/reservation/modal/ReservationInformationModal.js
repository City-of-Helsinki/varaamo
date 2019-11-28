import React, { useState } from 'react';
import {
  Modal, Row, Col, Button, ControlLabel, FormControl
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';

import ManageReservationsStatus from '../manage/status/ManageReservationsStatus';
import injectT from '../../../../app/i18n/injectT';
import { getDateAndTime } from '../manage/list/ManageReservationsList';
import { RESERVATION_STATE } from '../../../constants/ReservationState';
import ReservationMetadata from '../information/ReservationMetadata';
import ReservationCancelModal from './ReservationCancelModal';

const ReservationInformationModal = ({
  t, reservation, onHide, isOpen, onEditClick, onEditReservation, onSaveComment
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
      <div className="app-ReservationInformationModal__field">
        <Row>
          <Col className="app-ReservationInformationModal__field__label" xs={5}>
            <span>{t(`common.${(camelCase(label))}Label`)}</span>
          </Col>

          <Col className="app-ReservationInformationModal__field__value" xs={7}>
            <span>
              {value}
            </span>
          </Col>
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

          {/* Render default basic information fields */}
          <div className="app-ReservationInformationModal__information__account">
            {renderField('user_name', get(reservation, 'user.display_name', ''))}
            {renderField('user_email', get(reservation, 'user.email', ''))}
          </div>
          {renderField('reservation_time', getDateAndTime(reservation))}
          {renderField('resource', get(reservation, 'resource.name.fi', ''))}

          {/* Render reservation metadata (extra) fields */}
          <ReservationMetadata
            customField={renderField}
            reservation={reservation}
          />

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
          onClick={() => {
            // onEditReservation(reservation, RESERVATION_STATE.CANCELLED)
            toggleReservationCancelModal(!isReservationCancelModalOpen);
          }}
        >
          {t('ReservationInfoModal.cancelButton')}
        </Button>

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
          {t('ReservationInfoModal.confirmButton')}
        </Button>
      </Modal.Footer>
      <ReservationCancelModal
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
  onHide: PropTypes.func,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func,
  onSaveComment: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

export default injectT(ReservationInformationModal);
