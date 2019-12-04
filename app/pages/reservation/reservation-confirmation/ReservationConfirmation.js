import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';
import ReservationDate from '../../../shared/reservation-date/ReservationDate';
import { hasProducts } from '../../../utils/resourceUtils';
import { getReservationPrice, getReservationPricePerPeriod } from '../../../utils/reservationUtils';
import apiClient from '../../../../src/common/api/client';
import CompactReservationList from '../../../shared/compact-reservation-list/CompactReservationList';

class ReservationConfirmation extends Component {
  static propTypes = {
    failedReservations: PropTypes.array.isRequired,
    isEdited: PropTypes.bool,
    location: PropTypes.object,
    reservation: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  state = {
    reservationPrice: null,
  }

  componentDidMount() {
    const { reservation, resource } = this.props;
    if (hasProducts(resource)) {
      getReservationPrice(apiClient, reservation.begin, reservation.end, resource.products)
        .then(reservationPrice => this.setState({ reservationPrice }));
    }
  }

  getReturnUrl = (isEdited) => {
    const { location } = this.props;
    if (!isEdited) return '/my-reservations';

    const query = queryString.parse(location.search);
    return query.path ? '/manage-reservations' : '/my-reservations';
  };

  renderField(field, label, value) {
    return (
      <Row className="app-ReservationConfirmation__field" key={`reservation-confirmation-field-${field}`}>
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
      failedReservations, isEdited, reservation, resource, t, user
    } = this.props;
    const { reservationPrice } = this.state;
    const refUrl = window.location.href;
    const href = `${constants.FEEDBACK_URL}&ref=${refUrl}`;
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
            <h2 className="app-ReservationPage__title app-ReservationPage__title--big app-ReservationPage__header">
              {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
            </h2>
            <div className="app-ReservationConfirmation__highlight">
              <ReservationDate
                beginDate={reservation.begin}
                className="app-ReservationConfirmation__reservation-date"
                endDate={reservation.end}
              />
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

            {Array.isArray(failedReservations) && Boolean(failedReservations.length)
              && (
                <div>
                  <h5 className="app-ReservationConfirmation__error-msg-title">
                    {t('ReservationSuccessModal.failedReservationsHeader')}
                  </h5>
                  <CompactReservationList
                    className="failed-reservations-list"
                    reservations={failedReservations}
                    subtitle="failReason"
                  />
                </div>
              )
            }

            <p className="app-ReservationConfirmation__button-wrapper">
              <Link to={this.getReturnUrl(isEdited)}>
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
            {reservationPrice
              && this.renderField(
                'pricePerPeriod',
                t('common.priceLabel'),
                getReservationPricePerPeriod(resource)
              )}
            {reservationPrice
              && this.renderField(
                'reservationPrice',
                t('common.totalPriceLabel'),
                `${reservationPrice}€`
              )}
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
            {reservation.billingFirstName
              && this.renderField(
                'billingFirstName',
                t('common.billingFirstNameLabel'),
                reservation.billingFirstName
              )}
            {reservation.billingLastName
              && this.renderField(
                'billingLastName',
                t('common.billingLastNameLabel'),
                reservation.billingLastName
              )}
            {reservation.billingPhoneNumber
              && this.renderField(
                'billingPhoneNumber',
                t('common.billingPhoneNumberLabel'),
                reservation.billingPhoneNumber
              )}
            {reservation.billingEmailAddress
              && this.renderField(
                'billingEmailAddress',
                t('common.billingEmailAddressLabel'),
                reservation.billingEmailAddress
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
