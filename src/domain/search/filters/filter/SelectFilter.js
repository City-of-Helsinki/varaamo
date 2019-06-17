import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';
import classNames from 'classnames';

import injectT from '../../../../../app/i18n/injectT';

class SelectFilter extends React.Component {
  static propTypes = {
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

  getValue = (value, options) => {
    if (isArray(value)) {
      return value.map(item => options.find(option => option.value === item));
    }

    return options.find(option => option.value === value);
  };

  noOptionsMessage = () => this.props.t('SelectFilter.noOptionsMessage');

  onChange = (selected, action) => {
    const { onChange, isMulti } = this.props;

    if (action === 'clear') {
      onChange(isMulti ? [] : {}, action);
      return;
    }

    onChange(selected, action);
  };

  render() {
    const {
      id,
      className,
      isLoading = false,
      isClearable = true,
      isSearchable = true,
      isMulti,
      label,
      options,
      t,
      value,
    } = this.props;
    return (
      <div className="app-SelectFilter">
        <FormGroup controlId={id}>
          {label && <ControlLabel>{label}</ControlLabel>}
          {!isLoading
          && (
            <Select
              className={classNames('app-Select', className)}
              classNamePrefix="app-Select"
              id={id}
              isClearable={isClearable}
              isMulti={isMulti}
              isSearchable={isSearchable}
              noOptionsMessage={this.noOptionsMessage}
              onChange={(selected, { action }) => this.onChange(selected, action)}
              options={options}
              placeholder={t('common.select')}
              value={this.getValue(value, options)}
            />
          )}
        </FormGroup>
      </div>
    );
  }
}

export default injectT(SelectFilter);
