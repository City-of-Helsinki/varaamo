import moment from 'moment';
import React, { PropTypes } from 'react';
import Well from 'react-bootstrap/lib/Well';

import WrappedText from 'shared/wrapped-text';

function renderLoginText(isLoggedIn, resource) {
  if (isLoggedIn || !resource.reservable) {
    return null;
  }
  return (
    <p>
      Sinun täytyy <a href="/login">kirjautua sisään</a>, jotta voit tehdä varauksen tähän tilaan.
    </p>
  );
}

function renderMaxPeriodText(maxPeriod) {
  if (!maxPeriod) {
    return null;
  }
  const asHours = moment.duration(maxPeriod).asHours();
  return <p>{`Varauksen maksimipituus: ${asHours} tuntia`}</p>;
}

function renderMaxReservationsPerUserText(maxReservationsPerUser) {
  if (!maxReservationsPerUser) {
    return null;
  }
  return <p>{`Maksimimäärä varauksia per käyttäjä: ${maxReservationsPerUser}`}</p>;
}

function ReservationInfo({ isLoggedIn, resource }) {
  return (
    <Well id="reservation-info">
      <WrappedText text={resource.reservationInfo} />
      {renderMaxPeriodText(resource.maxPeriod)}
      {renderMaxReservationsPerUserText(resource.maxReservationsPerUser)}
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
};

export default ReservationInfo;
