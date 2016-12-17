import React, { PropTypes } from 'react';

import { injectT } from 'translations';

function ReservationAccessCode({ reservation, t, text }) {
  if (!reservation.accessCode) {
    return <span />;
  }

  return (
    <span className="reservation-access-code">
      {text || t('ReservationAccessCode.defaultText')}: {reservation.accessCode}
    </span>
  );
}

ReservationAccessCode.propTypes = {
  reservation: PropTypes.shape({
    accessCode: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  text: PropTypes.string,
};

export default injectT(ReservationAccessCode);
