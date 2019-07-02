import React from 'react';
import PropTypes from 'prop-types';

import Step from './Step';

const ProgressSteps = ({
  steps,
  activeStep = null,
  className = '',
}) => (
  <div className={`progress-steps ${className}`}>
    {steps.map((stepName, index) => (
      <React.Fragment key={stepName}>
        {
          index > 0 && <div className="progress-step-separator" />
        }
        <Step
          isActive={stepName === activeStep}
          label={stepName}
          number={index + 1}
        />
      </React.Fragment>
    ))}
  </div>
);

ProgressSteps.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  activeStep: PropTypes.string,
};

export default ProgressSteps;
