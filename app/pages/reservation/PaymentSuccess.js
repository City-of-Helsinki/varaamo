import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import flow from 'lodash/flow';
import get from 'lodash/get';

import { currentUserSelector } from '../../state/selectors/authSelectors';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';

const translateEntity = (entity, locale) => (
  Object
    .entries(entity)
    .reduce((acc, [key, value]) => {
      acc[key] = get(value, locale, value);
      return acc;
    }, {})
);

function PaymentSuccess({
  reservation,
  resource,
  user,
  intl: { locale },
}) {
  const translatedReservation = translateEntity(reservation, locale);
  const translatedResource = translateEntity(resource, locale);
  return (
    <div>
      <ReservationConfirmation
        reservation={translatedReservation}
        resource={translatedResource}
        user={user}
      />
    </div>
  );
}

PaymentSuccess.propTypes = {
  reservation: PropTypes.object,
  resource: PropTypes.object,
  user: PropTypes.object,
  intl: PropTypes.object,
};

export default flow(
  connect(
    state => ({
      user: currentUserSelector(state)
    })
  ),
  injectIntl,
)(PaymentSuccess);
