import React, { PropTypes } from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import { injectT } from 'i18n';

function CheckboxControl({ id, label, onConfirm, value }) {
  return (
    <div className="app-CheckboxControl">
      <FormGroup controlId={id}>
        <ControlLabel>{ }</ControlLabel>
        <Checkbox checked={value} onClick={e => onConfirm(e.target.checked)}>
          {label}
        </Checkbox>
      </FormGroup>
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
