import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';

import { injectT } from 'i18n';

class SelectControl extends React.Component {
  getValue = (value, options) => {
    if (isArray(value)) {
      return value.map(item => options.find(option => option.value === item));
    }

    return options.find(option => option.value === value);
  };

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
