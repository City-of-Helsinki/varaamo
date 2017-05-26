import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FontAwesome from 'react-fontawesome';
import NumericInput from 'react-numeric-input';

import { injectT } from 'i18n';
import MiniModal from 'shared/mini-modal';

PeopleCapacityControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.number,
};

function PeopleCapacityControl({ onChange, t, value }) {
  return (
    <div className="app-PeopleCapacityControl">
      <MiniModal
        buttonContent={
          <span><FontAwesome name="users" /> {value || ''}</span>
        }
        header={t('PeopleCapacityControl.header')}
        theme="orange"
      >
        <FormGroup controlId="people-capacity-control-group">
          <ControlLabel>
            {t('PeopleCapacityControl.label')}
          </ControlLabel>
          <NumericInput
            className="form-control"
            min={0}
            onChange={onChange}
            value={value || 0}
          />
        </FormGroup>
      </MiniModal>
    </div>
  );
}

export default injectT(PeopleCapacityControl);
