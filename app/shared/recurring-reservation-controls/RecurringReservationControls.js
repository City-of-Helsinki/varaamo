import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';

import { injectT } from 'i18n';

function createOptionRenderer(t) {
  return option => t(option.label);
}

function createValueRenderer(t) {
  return option => t(option.label);
}

function RecurringReservationControls(props) {
  if (!props.isVisible) {
    return <span />;
  }
  return (
    <div className="recurring-reservation-controls">
      <div className="recurring-reservation-frequency-control">
        <label htmlFor="recurrence-frequency-select">
          {props.t('RecurringReservationControls.frequencyLabel')}
        </label>
        <Select
          className="recurrence-frequency-select"
          clearable={false}
          inputProps={{ id: 'recurrence-frequency-select' }}
          name="recurrence-frequency-select"
          onChange={props.changeFrequency}
          optionRenderer={createOptionRenderer(props.t)}
          options={props.frequencyOptions}
          value={props.frequency}
          valueRenderer={createValueRenderer(props.t)}
        />
      </div>
      <FormGroup controlId="numberOfOccurrencesGroup">
        <ControlLabel>
          {props.t('RecurringReservationControls.numberOfOccurrencesLabel')}
        </ControlLabel>
        <FormControl
          min={1}
          onChange={event => props.changeNumberOfOccurrences(event.target.value || 1)}
          type="number"
          value={props.numberOfOccurrences}
        />
      </FormGroup>
    </div>
  );
}

RecurringReservationControls.propTypes = {
  changeFrequency: PropTypes.func.isRequired,
  changeNumberOfOccurrences: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  frequencyOptions: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  numberOfOccurrences: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(RecurringReservationControls);
