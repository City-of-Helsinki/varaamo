import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import { Link } from 'react-router-dom';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';
import ReservationDate from '../../../shared/reservation-date/ReservationDate';

class ReservationConfirmation extends Component {
  static propTypes = {
    isEdited: PropTypes.bool,
    reservation: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  renderField(field, label, value) {
    return (
      <Row key={`reservation-confirmation-field-${field}`}>
        <Col md={4} xs={6}>
          <span className="app-ReservationDetails__name">{label}</span>
        </Col>
        <Col md={8} xs={6}>
          <span className="app-ReservationDetails__value">{value}</span>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      isEdited, reservation, resource, t, user
    } = this.props;
    const refUrl = window.location.href;
    const href = `${constants.FEEDBACK_URL}?ref=${refUrl}`;
    let email = '';
    if (reservation.reserverEmailAddress) {
      email = reservation.reserverEmailAddress;
    } else if (reservation.user && reservation.user.email) {
      email = reservation.user.email;
    } else if (user.email) {
      email = user.email;
    }

    return (
      <Row className="app-ReservationConfirmation">
        <Col md={6} xs={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title app-ReservationPage__title--big">
              {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
            </h2>
            <div className="app-ReservationConfirmation__highlight">
              <ReservationDate beginDate={reservation.begin} className="app-ReservationConfirmation__reservation-date" endDate={reservation.end} />
              <p className="app-ReservationConfirmation__resource-name">
                <img
                  alt={resource.name}
                  className="app-ReservationConfirmation__icon"
                  src={iconHome}
                />
                <span>{resource.name}</span>
              </p>
            </div>
            {!isEdited && (
            <p>
              <FormattedHTMLMessage
                id="ReservationConfirmation.confirmationText"
                values={{ email }}
              />
            </p>
            )}
            <p>
              <FormattedHTMLMessage id="ReservationConfirmation.feedbackText" values={{ href }} />
            </p>
            <p className="app-ReservationConfirmation__button-wrapper">
              <Link to="/my-reservations">
                <Button bsStyle="primary" className="app-ReservationConfirmation__button">
                  {t('ReservationConfirmation.ownReservationButton')}
                </Button>
              </Link>
            </p>
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title">{t('ReservationConfirmation.reservationDetailsTitle')}</h2>
            {reservation.reserverName
              && this.renderField(
                'reserverName',
                t('common.reserverNameLabel'),
                reservation.reserverName
              )}
            {reservation.reserverId
              && this.renderField('reserverId', t('common.reserverIdLabel'), reservation.reserverId)}
            {reservation.reserverPhoneNumber
              && this.renderField(
                'reserverPhoneNumber',
                t('common.reserverPhoneNumberLabel'),
                reservation.reserverPhoneNumber
              )}
            {reservation.reserverEmailAddress
              && this.renderField(
                'reserverEmailAddress',
                t('common.reserverEmailAddressLabel'),
                reservation.reserverEmailAddress
              )}
            {reservation.eventSubject
              && this.renderField(
                'eventSubject',
                t('common.eventSubjectLabel'),
                reservation.eventSubject
              )}
            {reservation.eventDescription
              && this.renderField(
                'eventDescription',
                t('common.eventDescriptionLabel'),
                reservation.eventDescription
              )}
            {reservation.numberOfParticipants
              && this.renderField(
                'numberOfParticipants',
                t('common.numberOfParticipantsLabel'),
                reservation.numberOfParticipants
              )}
            {reservation.comments
              && this.renderField('comments', t('common.commentsLabel'), reservation.comments)}
            {reservation.reserverAddressStreet
              && this.renderField(
                'reserverAddressStreet',
                t('common.addressStreetLabel'),
                reservation.reserverAddressStreet
              )}
            {reservation.reserverAddressZip
              && this.renderField(
                'reserverAddressZip',
                t('common.addressZipLabel'),
                reservation.reserverAddressZip
              )}
            {reservation.reserverAddressCity
              && this.renderField(
                'reserverAddressCity',
                t('common.addressCityLabel'),
                reservation.reserverAddressCity
              )}
            {reservation.billingAddressStreet && (
              <Col xs={12}>{t('common.billingAddressLabel')}</Col>
            )}
            {reservation.billingAddressStreet
              && this.renderField(
                'billingAddressStreet',
                t('common.addressStreetLabel'),
                reservation.billingAddressStreet
              )}
            {reservation.billingAddressZip
              && this.renderField(
                'billingAddressZip',
                t('common.addressZipLabel'),
                reservation.billingAddressZip
              )}
            {reservation.billingAddressCity
              && this.renderField(
                'billingAddressCity',
                t('common.addressCityLabel'),
                reservation.billingAddressCity
              )}
          </div>
        </Col>
      </Row>
    );
  }
}

export default injectT(ReservationConfirmation);
