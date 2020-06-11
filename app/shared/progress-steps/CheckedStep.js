import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import completedIcon from '../../assets/icons/completed.svg';
import errorIcon from '../../assets/icons/error.svg';

function CheckedStep({ label, status }) {
  const indicatorClasses = classNames(
    'progress-step-indicator',
    'progress-step-indicator-status',
    `progress-step-indicator-status-${status}`
  );
  return (
    <div className="progress-step progress-step-checked">
      <div className={indicatorClasses}>
        {status === 'completed' && <img alt="Completed" src={completedIcon} />}
        {status === 'error' && <img alt="Error" src={errorIcon} />}
      </div>
      <div className="progress-step-label">{label}</div>
    </div>
  );
}

CheckedStep.propTypes = {
  status: PropTypes.oneOf(['completed', 'error']),
  label: PropTypes.string,
};

export default CheckedStep;
