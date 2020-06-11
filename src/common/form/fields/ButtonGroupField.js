import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';

const ButtonGroupField = ({ onChange, label, options, value, type, id }) => (
  <div className="app-ButtonGroupField">
    <FormGroup controlId={`buttonGroupField-${id}`}>
      {label && (
        <ControlLabel className="app-ButtonGroupField__label">
          {label}
        </ControlLabel>
      )}
      <ToggleButtonGroup
        className="app-ButtonGroupField__buttons"
        onChange={onChange}
        type={type}
        value={value}
      >
        {options.map((option) => (
          <ToggleButton
            className="app-ButtonGroupField__button"
            key={`${id}-button-${option.value}`}
            value={option.value}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormGroup>
  </div>
);

const OptionShape = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
});

ButtonGroupField.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
  ]),
  type: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(OptionShape),
};

export default ButtonGroupField;
