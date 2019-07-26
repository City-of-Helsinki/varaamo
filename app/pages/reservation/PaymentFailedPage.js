import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import CheckedProgressSteps from '../../shared/progress-steps/CheckedProgressSteps';
import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';

const stepIds = [
  'ReservationPhase.informationTitle',
  'ReservationPhase.paymentTitle',
  'ReservationPhase.confirmationTitle',
];

function PaymentFailedPage({
  t,
}) {
  const title = t('ReservationPage.newReservationTitle');
  const steps = stepIds.map(msgId => t(msgId));
  const completedSteps = [t('ReservationPhase.informationTitle')];
  return (
    <PageWrapper title={title} transparent>
      <div>
        <div className="app-ReservationPage__content">
          <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
            {title}
          </h1>
          <CheckedProgressSteps
            className="app-ReservationFailedPage__progress-steps"
            completedSteps={completedSteps}
            steps={steps}
          />
          <div className="app-ReservationFailedPage__contentbox">
            <h2>{t('payment.title')}</h2>
            <p>{t('payment.text')}</p>
            <Link className="app-ReservationFailedPage__link" to="/my-reservations">
              <Button bsStyle="primary">{t('payment.link')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

PaymentFailedPage.propTypes = {
  t: PropTypes.func,
};

export default injectT(PaymentFailedPage);
