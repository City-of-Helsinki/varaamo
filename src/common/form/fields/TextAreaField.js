import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

const TextAreaField = ({
  onChange,
  onKeyPress,
  label,
  placeholder,
  value,
  id,
  rows,
}) => (
  <FormGroup controlId={`textAreaField-${id}`}>
    {label && <ControlLabel className="app-TextAreaField__label">{label}</ControlLabel>}
    <FormControl
      className="app-TextAreaField__textarea"
      componentClass="textarea"
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      rows={rows}
      value={value}
    />
  </FormGroup>
);

TextAreaField.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  value: PropTypes.string.isRequired,
};

export default TextAreaField;
