import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import injectT from '../../i18n/injectT';

function PaymentFailed({
  t,
  resourceId
}) {
  return (
    <div className="app-ReservationFailedPage__contentbox">
      <h2>{t('payment.title')}</h2>
      <p>{t('payment.text')}</p>
      {resourceId && (
        <Link className="app-ReservationFailedPage__link" to={`/resources/${resourceId}`}>
          <Button bsStyle="primary">{t('payment.return')}</Button>
        </Link>
      )}
      <Link className="app-ReservationFailedPage__link app-ReservationFailedPage__link--last" to="/my-reservations">
        <Button bsStyle="primary">{t('payment.link')}</Button>
      </Link>
    </div>
  );
}

PaymentFailed.propTypes = {
  t: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(PaymentFailed);
