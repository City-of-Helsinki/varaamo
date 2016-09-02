import React, { PropTypes } from 'react';
import Input from 'react-bootstrap/lib/Input';

function ReduxFormField({ type, label, field, extraProps = {} }) {
  if (!field) {
    return null;
  }

  const hasError = field.error && field.touched;

  const labelClassName = [
    type === 'checkbox' ? '' : 'col-sm-3',
    extraProps.labelClassName || '',
  ].join(' ');

  const wrapperClassName = [
    type === 'checkbox' ? 'col-md-12 checkbox-field' : 'col-sm-9',
    extraProps.wrapperClassName || '',
  ].join(' ');

  return (
    <Input
      {...field}
      {...extraProps}
      bsStyle={hasError ? 'error' : null}
      help={hasError ? field.error : extraProps.help}
      label={label}
      labelClassName={labelClassName}
      type={type}
      wrapperClassName={wrapperClassName}
    />
  );
}

ReduxFormField.propTypes = {
  extraProps: PropTypes.object,
  field: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReduxFormField;
