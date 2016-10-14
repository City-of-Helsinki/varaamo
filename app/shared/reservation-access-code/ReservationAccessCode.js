import React, { PropTypes } from 'react';

function ReservationAccessCode({ reservation, text }) {
  if (!reservation.accessCode) {
    return <span />;
  }

  return (
    <span className="reservation-access-code">
      {text} {reservation.accessCode}
    </span>
  );
}

ReservationAccessCode.propTypes = {
  reservation: PropTypes.shape({
    accessCode: PropTypes.string,
  }).isRequired,
  text: PropTypes.string,
};

ReservationAccessCode.defaultProps = {
  text: 'PIN-koodi:',
};

export default ReservationAccessCode;
