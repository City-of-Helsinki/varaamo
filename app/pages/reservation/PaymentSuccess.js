import React from 'react';
import PropTypes from 'prop-types';

function PaymentSuccess({
  reservation,
  resource,
}) {
  return (
    <div>
      <span>{reservation.id}</span>
      <span>{resource.id}</span>
    </div>
  );
}

PaymentSuccess.propTypes = {
  reservation: PropTypes.object,
  resource: PropTypes.object,
};

export default PaymentSuccess;
