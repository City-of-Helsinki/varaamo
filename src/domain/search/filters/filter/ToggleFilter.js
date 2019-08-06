import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

function ToggleFilter({
  id,
  label,
  onChange,
  checked,
}) {
  return (
    <div className="app-ToggleFilter">
      <Toggle
        checked={checked}
        className="app-ToggleFilter__toggle"
        id={id}
        onChange={event => onChange(event.target.checked)}
      />
      <label className="app-ToggleFilter__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

ToggleFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
};

export default ToggleFilter;
