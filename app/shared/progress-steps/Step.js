import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Step = ({
  label,
  number,
  isActive,
}) => {
  const stepClasses = classNames(
    'progress-step',
    {
      'progress-step--active': isActive,
    },
  );
  return (
    <div className={stepClasses}>
      <div className="progress-step-number">
        {number}
      </div>
      <div className="progress-step-label">
        {label}
      </div>
    </div>
  );
};

Step.propTypes = {
  label: PropTypes.string,
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isActive: PropTypes.bool,
};

export default Step;
