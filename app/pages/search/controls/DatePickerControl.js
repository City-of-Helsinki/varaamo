import React, { PropTypes } from 'react';
import { Calendar } from 'react-date-picker';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import MiniModal from 'shared/mini-modal';

DatePickerControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.string,
};

function DatePickerControl({ onChange, t, value }) {
  return (
    <div className="app-DatePickerControl">
      <MiniModal
        buttonContent={
          <span><FontAwesome name="calendar" /> {value || ''}</span>
        }
        header={t('DatePickerControl.header')}
        theme="green"
      >
        <Calendar
          className="app-DatePickerControl__calendar"
          dateFormat={'L'}
          onChange={onChange}
          value={value}
        />
      </MiniModal>
    </div>
  );
}

export default injectT(DatePickerControl);
