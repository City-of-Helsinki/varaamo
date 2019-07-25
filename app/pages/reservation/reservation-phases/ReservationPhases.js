import PropTypes from 'prop-types';
import React from 'react';

import NumericalProgressSteps from '../../../shared/progress-steps/NumericalProgressSteps';
import injectT from '../../../i18n/injectT';
import { hasProducts } from '../../../utils/resourceUtils';

ReservationPhases.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  resource: PropTypes.object,
  isEditing: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

const phases = {
  information: 'ReservationPhase.informationTitle',
  confirmation: 'ReservationPhase.confirmationTitle',
  time: 'ReservationPhase.timeTitle',
  payment: 'ReservationPhase.paymentTitle',
};

function ReservationPhases({
  resource,
  currentPhase,
  isEditing,
  t,
}) {
  const stepMessageIds = ['information', 'confirmation'];

  if (isEditing) {
    stepMessageIds.splice(0, 0, 'time');
  }

  if (hasProducts(resource)) {
    stepMessageIds.splice(1, 0, 'payment');
  }

  const steps = stepMessageIds.map(id => t(phases[id]));
  const current = t(phases[currentPhase]);

  return (
    <NumericalProgressSteps
      activeStep={current}
      className="app-ReservationPage__phases"
      steps={steps}
    />
  );
}

export default injectT(ReservationPhases);
