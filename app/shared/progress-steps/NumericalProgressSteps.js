import React from 'react';
import PropTypes from 'prop-types';

import NumericalStep from './NumericalStep';

const NumericalProgressSteps = ({
  steps,
  activeStep = null,
  className = '',
}) => (
  <div className={`progress-steps progress-steps-numerical ${className}`}>
    {steps.map((stepName, index) => (
      <React.Fragment key={stepName}>
        {
          index > 0 && <div className="progress-step-separator" />
        }
        <NumericalStep
          isActive={stepName === activeStep}
          label={stepName}
          number={index + 1}
        />
      </React.Fragment>
    ))}
  </div>
);

NumericalProgressSteps.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  activeStep: PropTypes.string,
};

export default NumericalProgressSteps;
