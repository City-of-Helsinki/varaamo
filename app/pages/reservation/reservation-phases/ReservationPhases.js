import React, { PropTypes } from 'react';
import indexOf from 'lodash/indexOf';

import { injectT } from 'i18n';
import ReservationPhase from './ReservationPhase';

ReservationPhases.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

function ReservationPhases({ currentPhase, isEditing, t }) {
  const phases = ['information', 'confirmation'];
  if (isEditing) {
    phases.splice(0, 0, 'time');
  }
  const activeIndex = indexOf(phases, currentPhase);

  return (
    <div className="app-ReservationPage__phases row">
      {phases.map((phase, index) => (
        <ReservationPhase
          cols={12 / phases.length}
          index={index + 1}
          isActive={phase === currentPhase}
          isCompleted={index < activeIndex}
          key={phase}
          title={t(`ReservationPhase.${phase}Title`)}
        />
      ))}
    </div>
  );
}

export default injectT(ReservationPhases);
