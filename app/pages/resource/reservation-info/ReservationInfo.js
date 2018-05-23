import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import iconClock from 'assets/icons/clock-o.svg';
import WrappedText from 'shared/wrapped-text';
import { getMaxPeriodText } from 'utils/resourceUtils';
import { injectT } from 'i18n';

function renderLoginText(isLoggedIn, resource) {
  if (isLoggedIn || !resource.reservable) {
    return null;
  }
  return (
    <p className="login-text">
      <FormattedHTMLMessage id="ReservationInfo.loginMessage" />
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
      <b>{t('ReservationInfo.reservationMaxLength')}</b> {maxPeriodText}
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
      <b>{t('ReservationInfo.maxNumberOfReservations')}</b> {maxReservationsPerUser}
    </p>
  );
}

function ReservationInfo({ isLoggedIn, resource, t }) {
  return (
    <div className="app-ReservationInfo">
      <WrappedText text={resource.reservationInfo} />
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
