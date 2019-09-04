import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import injectT from '../../i18n/injectT';

function PaymentFailed({
  t,
}) {
  return (
    <div className="app-ReservationFailedPage__contentbox">
      <h2>{t('payment.title')}</h2>
      <p>{t('payment.text')}</p>
      <Link className="app-ReservationFailedPage__link" to="/my-reservations">
        <Button bsStyle="primary">{t('payment.link')}</Button>
      </Link>
    </div>
  );
}

PaymentFailed.propTypes = {
  t: PropTypes.func,
};

export default injectT(PaymentFailed);
