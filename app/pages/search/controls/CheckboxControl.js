import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';
import classnames from 'classnames';

import { injectT } from 'i18n';

function CheckboxControl({
  id, label, labelClassName, onConfirm, toggleClassName, value,
}) {
  const toggleClassNames = classnames('app-CheckboxControl__toggle', toggleClassName);
  const labelClassNames = classnames('app-CheckboxControl__label', labelClassName);

  return (
    <div className="app-CheckboxControl">
      <Toggle
        className={toggleClassNames}
        defaultChecked={value}
        id={id}
        onChange={e => onConfirm(e.target.checked)}
      />
      <label className={labelClassNames} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

CheckboxControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  toggleClassName: PropTypes.string,
  value: PropTypes.bool,
};

export default injectT(CheckboxControl);
