import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import recurringReservations from 'state/recurringReservations';

function selectFrequencyOptions() {
  return [
    { label: 'RecurringReservationControls.frequencyNone', value: '' },
    { label: 'RecurringReservationControls.frequencyDaily', value: 'days' },
    { label: 'RecurringReservationControls.frequencyWeekly', value: 'weeks' },
    { label: 'RecurringReservationControls.frequencyMonthly', value: 'months' },
  ];
}

const selector = createStructuredSelector({
  frequency: recurringReservations.selectFrequency,
  frequencyOptions: selectFrequencyOptions,
  numberOfOccurrences: recurringReservations.selectNumberOfOccurrences,
});

const actions = {
  changeFrequency: recurringReservations.changeFrequency,
  changeNumberOfOccurrences: recurringReservations.changeNumberOfOccurrences,
};

export function mergeProps(stateProps, dispatchProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    changeFrequency: ({ value }) => dispatchProps.changeFrequency(value),
  };
}

export default connect(selector, actions, mergeProps);
