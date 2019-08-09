import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

const TextField = ({
  onChange,
  onKeyPress,
  label,
  placeholder,
  value,
  id,
}) => (
  <div className="app-TextField">
    <FormGroup controlId={`textField-${id}`}>
      {label && <ControlLabel className="app-TextField__label">{label}</ControlLabel>}
      <FormControl
        className="app-TextField__input"
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </FormGroup>
  </div>
);

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default TextField;
