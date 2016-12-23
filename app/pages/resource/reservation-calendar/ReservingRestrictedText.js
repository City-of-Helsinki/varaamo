import moment from 'moment';
import React, { PropTypes } from 'react';

import { injectT } from 'i18n';

function ReservingRestrictedText({ reservableBefore, reservableDaysInAdvance, t }) {
  const dateFormat = 'D.M.YYYY';
  const today = moment().format(dateFormat);
  const until = moment(reservableBefore).format(dateFormat);

  return (
    <p className="info-text">
      {t('ReservingRestrictedText.reservationRestricted', { days: reservableDaysInAdvance })}{' '}
      {t('ReservingRestrictedText.reservationAvailableBetween', { today, until })}
    </p>
  );
}

ReservingRestrictedText.propTypes = {
  reservableBefore: PropTypes.string.isRequired,
  reservableDaysInAdvance: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservingRestrictedText);
