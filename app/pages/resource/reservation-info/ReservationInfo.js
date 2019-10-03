import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import moment from 'moment';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import iconCalendar from '../../../assets/icons/calendar.svg';
import iconClock from '../../../assets/icons/clock-o.svg';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import { getMaxPeriodText } from '../../../utils/resourceUtils';
import injectT from '../../../i18n/injectT';

function renderLoginText(isLoggedIn, resource) {
  if (isLoggedIn || !resource.reservable) {
    return null;
  }
  const next = encodeURIComponent(window.location.href);
  return (
    <p className="login-text">
      <FormattedHTMLMessage id="ReservationInfo.loginMessage" values={{ next }} />
    </p>
  );
}

function renderEarliestResDay(date, t) {
  if (!date) {
    return null;
  }
  return (
    <p className="reservable-after-text">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconCalendar} />
      <strong>{t('ReservationInfo.reservationEarliestDays', { time: moment(date).toNow(true) })}</strong>
    </p>
  );
}

function renderMaxPeriodText(resource, t) {
  if (!resource.maxPeriod) {
    return null;
  }
  const maxPeriodText = getMaxPeriodText(t, resource);
  return (
    <p className="max-length-text">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconClock} />
      <strong>{t('ReservationInfo.reservationMaxLength')}</strong>
      {` ${maxPeriodText}`}
    </p>
  );
}

function renderMaxReservationsPerUserText(maxReservationsPerUser, t) {
  if (!maxReservationsPerUser) {
    return null;
  }
  return (
    <p className="max-number-of-reservations-text">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconUser} />
      <strong>{t('ReservationInfo.maxNumberOfReservations')}</strong>
      {` ${maxReservationsPerUser}`}
    </p>
  );
}

function ReservationInfo({ isLoggedIn, resource, t }) {
  return (
    <div className="app-ReservationInfo">
      <WrappedText openLinksInNewTab text={resource.reservationInfo} />
      {renderEarliestResDay(resource.reservableAfter, t)}
      {renderMaxPeriodText(resource, t)}
      {renderMaxReservationsPerUserText(resource.maxReservationsPerUser, t)}
      {renderLoginText(isLoggedIn, resource)}
    </div>
  );
}

ReservationInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.shape({
    maxPeriod: PropTypes.string,
    maxReservationsPerUser: PropTypes.number,
    reservable: PropTypes.bool,
    reservationInfo: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationInfo);
