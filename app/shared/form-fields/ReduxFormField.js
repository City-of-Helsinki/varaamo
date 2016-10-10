import React, { PropTypes } from 'react';

import Checkbox from './Checkbox';
import FormControl from './FormControl';

function ReduxFormField({ controlProps = {}, field, help, label, type }) {
  const showError = field.error && field.touched;
  const props = {
    controlProps: Object.assign({}, field, controlProps),
    help: showError ? field.error : help,
    id: field.name,
    label,
    type,
    validationState: showError ? 'error' : undefined,
  };

  if (type === 'checkbox') {
    return <Checkbox {...props} />;
  }

  return <FormControl {...props} />;
}

ReduxFormField.propTypes = {
  controlProps: PropTypes.object,
  field: PropTypes.object.isRequired,
  help: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReduxFormField;
