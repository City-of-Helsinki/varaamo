import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from './Checkbox';
import FormControl from './FormControl';

function ReduxFormField({
  controlProps = {}, help, info, input, label, meta, name, type
}) {
  const showError = meta.error && meta.touched;
  const props = {
    controlProps: Object.assign({}, input, controlProps),
    help: showError ? meta.error : help,
    id: name,
    info,
    label,
    type,
    validationState: showError ? 'error' : undefined
  };

  if (type === 'checkbox') {
    return <Checkbox {...props} />;
  }

  return <FormControl {...props} />;
}

ReduxFormField.propTypes = {
  controlProps: PropTypes.object,
  help: PropTypes.string,
  info: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default ReduxFormField;
