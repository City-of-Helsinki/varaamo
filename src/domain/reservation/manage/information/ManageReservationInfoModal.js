import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import ManageReservationsStatus from '../status/ManageReservationsStatus';
import injectT from '../../../../../app/i18n/injectT';
import { getDateAndTime } from '../list/ManageReservationsList';

const ManageReservationInfoModal = ({ t, reservation }) => {
  const renderField = (label, value) => {
    return (
      <Row>
        <Col xs={3}><h5>{t(label)}</h5></Col>
        <Col xs={9}><span>{value}</span></Col>
      </Row>
    );
  };
  return (
    <Modal
      className="app-ManageReservationInfoModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('ReservationInfoModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManageReservationsStatus reservation={reservation} />
        <div className="app-ManageReservationInfoModal__information">
          <div className="app-ManageReservationInfoModal__information__account">
            {renderField('common.userNameLabel', get(reservation, 'user.display_name', ''))}
            {renderField('common.userEmailLabel', get(reservation, 'user.email', ''))}
          </div>
          {renderField('common.reserverNameLabel', get(reservation, 'reserver_name', ''))}
          {renderField('common.eventDescriptionLabel', get(reservation, 'event_description', ''))}
          {renderField('common.reservationTimeLabel', getDateAndTime(reservation))}
          {renderField('common.resourceLabel', get(reservation, 'resource.name.fi', ''))}
          {renderField('common.reserverPhoneNumberLabel', get(reservation, 'reserver_phone_number', ''))}
        </div>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>
  );
};

ManageReservationInfoModal.propTypes = {
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired
};

export default injectT(ManageReservationInfoModal);
