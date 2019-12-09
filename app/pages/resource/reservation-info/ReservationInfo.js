import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import moment from 'moment';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import iconCalendar from '../../../assets/icons/calendar.svg';
import iconClock from '../../../assets/icons/clock-o.svg';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import { getMaxPeriodText, getMinPeriodText } from '../../../utils/resourceUtils';
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


function renderEarliestResDay(resource, t) {
  if (!resource.reservableAfter && !resource.reservableMinDaysInAdvance) {
    return null;
  }
  const time = resource.reservableAfter
    ? moment(resource.reservableAfter).toNow(true)
    : moment().add(resource.reservableMinDaysInAdvance, 'days').toNow(true);
  return (
    <p className="reservable-after-text">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconCalendar} />
      <strong>{t('ReservationInfo.reservationEarliestDays', { time })}</strong>
    </p>
  );
}

const renderLastResDay = (resource, t) => {
  if (!resource.reservableBefore && !resource.reservableMaxDaysInAdvance) {
    return null;
  }
  const time = resource.reservableBefore
    ? moment(resource.reservableBefore).toNow(true)
    : moment().add(resource.reservableMaxDaysInAdvance, 'days').toNow(true);

  const date = resource.reservableBefore
    ? moment(resource.reservableBefore).format('DD.MM.YYYY')
    : moment().add(resource.reservableMaxDaysInAdvance, 'days').format('DD.MM.YYYY');
  return (
    <p className="reservable-before-text">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconCalendar} />
      <strong>{t('ReservationInfo.reservationLatestDays', { time, date })}</strong>
    </p>
  );
};

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

function renderMinPeriodText(resource, t) {
  if (!resource.minPeriod) {
    return null;
  }
  const minPeriodText = getMinPeriodText(t, resource);
  return (
    <p className="app-ResourcePage__content-min-period">
      <img alt="" className="app-ResourceHeader__info-icon" src={iconClock} />
      <strong>{t('ReservationInfo.reservationMinLength')}</strong>
      {` ${minPeriodText}`}
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
      {renderEarliestResDay(resource, t)}
      {renderLastResDay(resource, t)}
      {renderMinPeriodText(resource, t)}
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
