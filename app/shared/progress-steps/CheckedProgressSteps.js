import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';

import CheckedStep from './CheckedStep';

function CheckedProgressSteps({
  steps,
  completedSteps,
  className = '',
}) {
  return (
    <div className={`progress-steps progress-steps-checked ${className}`}>
      {steps.map((stepName, index) => (
        <React.Fragment key={stepName}>
          {
            index > 0 && <div className="progress-step-separator" />
          }
          <CheckedStep
            label={stepName}
            status={includes(completedSteps, stepName) ? 'completed' : 'error'}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

CheckedProgressSteps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  completedSteps: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default CheckedProgressSteps;
