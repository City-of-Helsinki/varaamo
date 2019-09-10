import PropTypes from 'prop-types';
import React from 'react';

import Phases from './Phases';
import { hasProducts } from '../../../../../app/utils/resourceUtils';
import { RESERVATION_PHASE } from '../../constants';
import injectT from '../../../../../app/i18n/injectT';

ReservationPhases.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  resource: PropTypes.object,
  t: PropTypes.func.isRequired,
};

function ReservationPhases({
  resource,
  currentPhase,
  t,
}) {
  const phaseMessageIds = hasProducts(resource)
    ? [RESERVATION_PHASE.TIME, RESERVATION_PHASE.INFORMATION, RESERVATION_PHASE.PAYMENT, RESERVATION_PHASE.INFORMATION]
    : [RESERVATION_PHASE.TIME, RESERVATION_PHASE.INFORMATION, RESERVATION_PHASE.CONFIRMATION];

  const phases = phaseMessageIds.map(id => t(`ReservationPhase.${id}Title`));
  const current = t(`ReservationPhase.${currentPhase}Title`);

  return (
    <Phases
      activePhase={current}
      phases={phases}
    />
  );
}

export default injectT(ReservationPhases);
