import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';

import { injectT } from 'i18n';

function SelectControl({
  id, isLoading, label, onConfirm, options, t, value,
}) {
  return (
    <div className="app-SelectControl">
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        {!isLoading && (
        <Select
          clearable
          name={id}
          onChange={option => onConfirm(option ? option.value : '')}
          options={options}
          placeholder={t('common.select')}
          searchable
          value={value || ''}
        />
        )}
      </FormGroup>
    </div>
  );
}

  render() {
    const {
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
      ...rest } = this.props;

    return (
      <div className="app-SelectControl">
        <FormGroup controlId={id}>
          {label && <ControlLabel>{label}</ControlLabel>}
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
                    onChange(isMulti ? [] : {}, action);
                    break;
                  default:
                    onChange(selected, action);
                    break;
                }
              }}
              options={options}
              placeholder={t('common.select')}
              value={this.getValue(value, options)}
            />}
        </FormGroup>
      </div>
    );
  }
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
