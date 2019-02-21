import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';

import { injectT } from 'i18n';

const getValue = (value, options) => {
  if (value) {
    if (isArray(value)) {
      return value.map(item => options.find(option => option.value === item));
    }

    return options.find(option => option.value === value);
  }

  return null;
};

function SelectControl({ id, isLoading, isMulti, label, onChange, options, t, value }) {
  return (
    <div className="app-SelectControl">
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        {!isLoading && <Select
          className="app-Select"
          classNamePrefix="app-Select"
          isClearable
          isMulti={!!isMulti}
          isSearchable
          name={id}
          onChange={(selected, { action }) => {
            switch (action) {
              case 'clear':
                onChange('', action);
                break;
              default:
                onChange(
                  !isMulti ? selected.value : selected.map(option => option.value),
                  action
                );
                break;
            }
          }}
          options={options}
          placeholder={t('common.select')}
          value={getValue(value, options)}
        />}
      </FormGroup>
    </div>
  );
}

SelectControl.propTypes = {
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType(PropTypes.string, PropTypes.arrayOf(PropTypes.string)),
};

export default injectT(SelectControl);
