import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';

function ReservationAccessCode({ accessCode, t, text }) {
  return (
    <span className="reservation-access-code">
      {text || t('ReservationAccessCode.defaultText')}
      {' '}
      {accessCode}
    </span>
  );
}

ReservationAccessCode.propTypes = {
  accessCode: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  text: PropTypes.string,
};

export default injectT(ReservationAccessCode);
