import moment from 'moment';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Well from 'react-bootstrap/lib/Well';

import WrappedText from 'shared/wrapped-text';
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

function renderMaxPeriodText(maxPeriod, t) {
  if (!maxPeriod) {
    return null;
  }
  const asHours = moment.duration(maxPeriod).asHours();
  return (
    <p className="max-length-text">
      {t('ReservationInfo.reservationMaxLength', { asHours })}
    </p>
  );
}

function renderMaxReservationsPerUserText(maxReservationsPerUser, t) {
  if (!maxReservationsPerUser) {
    return null;
  }
  return (
    <p className="max-number-of-reservations-text">
      {t('ReservationInfo.maxNumberOfReservations', { maxReservationsPerUser })}
    </p>
  );
}

function ReservationInfo({ isLoggedIn, resource, t }) {
  return (
    <Well id="reservation-info">
      <WrappedText text={resource.reservationInfo} />
      {renderMaxPeriodText(resource.maxPeriod, t)}
      {renderMaxReservationsPerUserText(resource.maxReservationsPerUser, t)}
      {renderLoginText(isLoggedIn, resource)}
    </Well>
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
