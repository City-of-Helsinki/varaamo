import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import classNames from 'classnames';

import CheckedStep from './CheckedStep';

function CheckedProgressSteps({
  steps,
  completedSteps,
  className = '',
}) {
  const classes = classNames(
    'progress-steps',
    'progress-steps-checked',
    className,
  );
  return (
    <div className={classes}>
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
