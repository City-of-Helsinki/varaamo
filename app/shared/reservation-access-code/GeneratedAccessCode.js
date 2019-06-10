import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../i18n/injectT';

function GeneratedAccessCode({ accessCode, t, text }) {
  return (
    <span className="reservation-access-code">
      {text || t('ReservationAccessCode.defaultText')}
      {' '}
      {accessCode}
    </span>
  );
}

GeneratedAccessCode.propTypes = {
  accessCode: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  text: PropTypes.string,
};

export default injectT(GeneratedAccessCode);
