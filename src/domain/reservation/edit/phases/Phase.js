import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Phase = ({
  label,
  number,
  isActive,
}) => {
  const PhaseClasses = classNames(
    'app-phase',
    {
      'app-phase--active': isActive,
    },
  );
  return (
    <div className={PhaseClasses}>
      <div className="app-phase-indicator">
        {number}
      </div>
      <div className="app-phase-label">
        {label}
      </div>
    </div>
  );
};

Phase.propTypes = {
  label: PropTypes.string,
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isActive: PropTypes.bool,
};

export default Phase;
