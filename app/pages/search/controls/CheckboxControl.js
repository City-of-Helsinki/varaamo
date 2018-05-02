import React, { PropTypes } from 'react';
import Toggle from 'react-toggle';

import { injectT } from 'i18n';

function CheckboxControl({ id, label, onConfirm, value }) {
  return (
    <div className="app-CheckboxControl">
      <Toggle
        className="app-CheckboxControl__toggle"
        defaultChecked={value}
        id={id}
        onChange={e => onConfirm(e.target.checked)}
      />
      <label className="app-CheckboxControl__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

CheckboxControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  value: PropTypes.bool,
};

export default injectT(CheckboxControl);
