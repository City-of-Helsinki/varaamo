import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

const TextFilter = ({ onChange, onSearch, label, placeholder, value, id }) => (
  <div className="app-TextFilter">
    <FormGroup controlId={`textFilter-${id}`}>
      {label && <ControlLabel>{label}</ControlLabel>}
      <FormControl
        className="app-TextFilter__text-field"
        onChange={(event) => onChange(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            onSearch();
          }
        }}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </FormGroup>
  </div>
);

TextFilter.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default TextFilter;
