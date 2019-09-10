import React from 'react';
import PropTypes from 'prop-types';

import Phase from './Phase';

const Phases = ({
  phases,
  activePhase = null,
  className = '',
}) => (
  <div className={`app-phases ${className}`}>
    {phases.map((phaseName, index) => (
      <React.Fragment key={phaseName}>
        {
          index > 0 && <div className="app-phase-separator" />
        }
        <Phase
          isActive={phaseName === activePhase}
          label={phaseName}
          number={index + 1}
        />
      </React.Fragment>
    ))}
  </div>
);

Phases.propTypes = {
  className: PropTypes.string,
  phases: PropTypes.arrayOf(PropTypes.string),
  activePhase: PropTypes.string,
};

export default Phases;
