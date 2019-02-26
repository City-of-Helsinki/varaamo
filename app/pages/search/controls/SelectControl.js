import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';

import { injectT } from 'i18n';

const getValue = (value, options) => {
  if (isArray(value)) {
    return value.map(item => options.find(option => option.value === item));
  }

  return options.find(option => option.value === value);
};

function SelectControl({
  id,
  className = 'app-Select',
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  isMulti,
  label,
  onChange,
  options,
  t,
  value,
  ...rest }) {
  return (
    <div className="app-SelectControl">
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        {!isLoading &&
          <Select
            {...rest}
            className={className}
            classNamePrefix="app-Select"
            id={id}
            isClearable={isClearable}
            isMulti={isMulti}
            isSearchable={isSearchable}
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
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
};

export default injectT(SelectControl);
