import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../i18n/injectT';

const PendingAccessCode = ({ t }) => (
  <span className="pending-access-code">
    {t('ReservationAccessCode.pending')}
  </span>
);

PendingAccessCode.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(PendingAccessCode);
