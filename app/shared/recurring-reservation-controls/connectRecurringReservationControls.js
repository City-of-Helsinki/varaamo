import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import recurringReservations from 'state/recurringReservations';

function selectFrequencyOptions() {
  return [
    { label: 'RecurringReservationControls.frequencyNone', value: '' },
    { label: 'RecurringReservationControls.frequencyDaily', value: 'days' },
    { label: 'RecurringReservationControls.frequencyWeekly', value: 'weeks' },
    { label: 'RecurringReservationControls.frequencyMonthly', value: 'months' },
  ];
}

const isVisibleSelector = createSelector(
  recurringReservations.selectBaseTime,
  baseTime => Boolean(baseTime),
);

export const selector = createStructuredSelector({
  frequency: recurringReservations.selectFrequency,
  frequencyOptions: selectFrequencyOptions,
  isVisible: isVisibleSelector,
  lastTime: recurringReservations.selectLastTime,
  numberOfOccurrences: recurringReservations.selectNumberOfOccurrences,
});

const actions = {
  changeFrequency: recurringReservations.changeFrequency,
  changeLastTime: recurringReservations.changeLastTime,
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
