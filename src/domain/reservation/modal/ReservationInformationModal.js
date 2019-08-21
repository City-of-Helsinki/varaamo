import React, { useState } from 'react';
import {
  Modal, Row, Col, Button, ControlLabel, FormControl
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import ManageReservationsStatus from '../manage/status/ManageReservationsStatus';
import injectT from '../../../../app/i18n/injectT';
import { getDateAndTime } from '../manage/list/ManageReservationsList';

const ReservationInformationModal = ({
  t, reservation, onHide, isOpen, handleSaveComment
}) => {
  const [comment, setComment] = useState(get(reservation, 'comments', ''));
  const saveComment = () => handleSaveComment(comment);

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
        <ControlLabel>
          {t('common.commentsLabel')}
          :
        </ControlLabel>
        <form className="comments-form">
          <FormControl
            componentClass="textarea"
            // disabled
            // eslint-disable-next-line no-return-assign
            // inputRef={ref => this.commentsInput = ref}
            onChange={(e) => {
              console.log('setComment', e);
              console.log('setComment', e.target.value);
              setComment(e.target.value);
            }}
            placeholder={t('common.commentsPlaceholder')}
            rows={5}
            value={comment}
          />
          <div className="form-controls">
            <Button
              bsStyle="primary"
              // disabled={disabled}
              onClick={saveComment}
            >
              {t('ReservationInfoModal.saveComment')}
            </Button>
          </div>
        </form>

        {/* <form className="comments-form">
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
              </form> */}
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
        >
          {t('common.back')}
        </Button>

        <Button
          bsStyle="primary"
        >
          {t('ReservationInfoModal.denyButton')}
        </Button>

        <Button
          bsStyle="primary"
        >
          {t('ReservationInfoModal.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ReservationInformationModal.propTypes = {
  t: PropTypes.func.isRequired,
  handleSaveComment: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  onHide: PropTypes.func,
  isOpen: PropTypes.bool
};

export default injectT(ReservationInformationModal);
