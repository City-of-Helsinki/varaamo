import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Constants from '../../../../app/constants/AppConstants';
import injectT from '../../../../app/i18n/injectT';
import { getIsSlotReserved, getIsSlotInPast, getInMs } from './resourceKeyboardSlotPickerUtils';

const rootClass = 'app-ResourcePageKeyboardTimePicker';

function getClassName(className) {
  return `${rootClass}__${className}`;
}

const classes = {
  root: rootClass,
  fieldGrid: getClassName('field-grid'),
};

function getTime(dateTime) {
  const dateTimeInAppTimeZone = moment(dateTime).tz(Constants.TIME_ZONE);

  return dateTimeInAppTimeZone.format('HH:mm');
}

function getSlotCount(time, slotSize) {
  const [timeHours, timeMinutes] = time.split(':');
  const timeInMs = getInMs(timeHours, timeMinutes);
  const [slotHours, slotMinutes] = slotSize.split(':');
  const slotSizeInMs = getInMs(slotHours, slotMinutes);

  return timeInMs / slotSizeInMs;
}

function labelStartTimeOptions(
  slotsWithReservationStatus,
  selectedBounds,
  maxSlotCount,
  minSlotCount,
) {
  // If there's no end bound any time is ok.
  // If both bounds are set, any time are ok. When the use selects a
  // bound, the companion bound is reset.
  if (!selectedBounds.end || (selectedBounds.start && selectedBounds.end)) {
    return slotsWithReservationStatus.map(slot => ({
      ...slot,
      isResultsInNegativeTime: false,
      isResultsInOverlappingReservation: false,
      isResultsInUnderMinTime: false,
      isResultsInOverMaxTime: false,
    }));
  }

  // eslint-disable-next-line max-len
  const getIsResultsInNegativeTime = slotStart => new Date(slotStart).getTime() > new Date(selectedBounds.end).getTime();

  const closestReservationIndexBeforeEndBound = slotsWithReservationStatus.findIndex(
    slot => !getIsResultsInNegativeTime(slot.start) && slot.isReserved,
  );
  const endBoundIndex = slotsWithReservationStatus.findIndex(
    slot => makeEndTimeOverlap(slot.end) === selectedBounds.end,
  );
  const slotsWithLabels = slotsWithReservationStatus.map((slot, index) => {
    // Start times should never be after end time.
    const isResultsInNegativeTime = getIsResultsInNegativeTime(slot.start);
    // We should not offer the user options which allow them to to
    // make overlapping reservations. To this end, we are hiding all
    // options that come before the closest reservation that comes
    // before endBound.
    const isResultsInOverlappingReservation = closestReservationIndexBeforeEndBound !== -1
      && index <= closestReservationIndexBeforeEndBound;
    const isResultsInUnderMinTime = endBoundIndex - index < minSlotCount - 1;
    const isResultsInOverMaxTime = endBoundIndex - index > maxSlotCount - 1;

    return {
      ...slot,
      isResultsInNegativeTime,
      isResultsInOverlappingReservation,
      isResultsInUnderMinTime,
      isResultsInOverMaxTime,
    };
  });

  return slotsWithLabels;
}

function labelEndTimeOptions(
  slotsWithReservationStatus,
  selectedBounds,
  maxSlotCount,
  minSlotCount,
) {
  // If there's no start bound any time is ok.
  // If both bounds are set, any time are ok. When the use selects a
  // bound, the companion bound is reset.
  if (!selectedBounds.start || (selectedBounds.start && selectedBounds.end)) {
    return slotsWithReservationStatus.map(slot => ({
      ...slot,
      isResultsInNegativeTime: false,
      isResultsInOverlappingReservation: false,
      isResultsInUnderMinTime: false,
      isResultsInOverMaxTime: false,
    }));
  }

  // eslint-disable-next-line max-len
  const getIsResultsInNegativeTime = slotStart => new Date(slotStart).getTime() < new Date(selectedBounds.start).getTime();

  const startBoundIndex = slotsWithReservationStatus.findIndex(
    slot => slot.start === selectedBounds.start,
  );
  const firstReservationAfterSlotIndex = slotsWithReservationStatus.findIndex(
    (slot, j) => startBoundIndex < j && slot.isReserved,
  );
  const slotsWithLabels = slotsWithReservationStatus.map((slot, index) => {
    // Start times should never be after end time.
    const isResultsInNegativeTime = getIsResultsInNegativeTime(slot.start);
    // We should not offer the user options which allow them to to
    // make overlapping reservations. To this end, we are hiding all
    // options that come after the first reservation after this slot
    const isResultsInOverlappingReservation = firstReservationAfterSlotIndex !== -1
      && index >= firstReservationAfterSlotIndex;
    const isResultsInUnderMinTime = index - startBoundIndex < minSlotCount - 1;
    const isResultsInOverMaxTime = index - startBoundIndex > maxSlotCount - 1;

    return {
      ...slot,
      isResultsInNegativeTime,
      isResultsInOverlappingReservation,
      isResultsInUnderMinTime,
      isResultsInOverMaxTime,
    };
  });

  return slotsWithLabels;
}

function getIsOptionDisabled(option) {
  return (
    option.isReserved
    || option.isPast
    || option.isResultsInNegativeTime
    || option.isResultsInOverlappingReservation
    || option.isResultsInOverMaxTime
    || option.isResultsInUnderMinTime
  );
}

function makeEndTimeOverlap(slotEnd) {
  // Add one millisecond. After this, this ending time equals the next
  // slot's starting time.
  return new Date(new Date(slotEnd).getTime() + 1).toJSON();
}

// These are a hack that force more a more select like appearance that
// includes a chevron.
const inlineStyles = {
  '-webkit-appearance': 'auto',
};

const ResourcePageKeyboardTimePicker = ({
  slots,
  slotSize,
  reservations,
  onTimeChange,
  t,
  maxPeriod,
  minPeriod,
  selectedTime,
  defaultStartTime,
}) => {
  const startTouched = React.useRef(false);

  const setBounds = (boundsPartial) => {
    const nextSlotBounds = { ...selectedTime, ...boundsPartial };

    onTimeChange(nextSlotBounds);
  };

  const handleStartTimeChange = (event) => {
    const nextStart = event.target.value;
    const isStartingAgain = selectedTime.start && selectedTime.end;
    const nextSelectedTime = isStartingAgain
      ? { start: nextStart, end: null }
      : { start: nextStart };

    setBounds(nextSelectedTime);
  };
  const handleStartTimeFocus = () => {
    if (!selectedTime.start && !startTouched.current) {
      setBounds({ start: defaultStartTime });
    }

    startTouched.current = true;
  };
  const handleEndTimeChange = (event) => {
    const nextEnd = event.target.value;
    const isStartingAgain = selectedTime.start && selectedTime.end;
    const nextSelectedTime = isStartingAgain
      ? { end: nextEnd, start: null }
      : { end: nextEnd };

    setBounds(nextSelectedTime);
  };

  const startId = 'startTime';
  const endId = 'endTime';
  const slotsWithReservationStatus = slots.map(slot => ({
    ...slot,
    isReserved: getIsSlotReserved(slot, reservations),
    isPast: getIsSlotInPast(slot),
  }));
  const maxSlotCount = getSlotCount(maxPeriod, slotSize);
  const minSlotCount = getSlotCount(minPeriod, slotSize);
  const startTimeSlots = labelStartTimeOptions(
    slotsWithReservationStatus,
    selectedTime,
    maxSlotCount,
    minSlotCount,
  );
  const endTimeSlots = labelEndTimeOptions(
    slotsWithReservationStatus,
    selectedTime,
    maxSlotCount,
    minSlotCount,
  );
  const startDropdownOptions = startTimeSlots.map(slot => ({
    ...slot,
    label: getTime(slot.start),
  }));
  const endDropdownOptions = endTimeSlots.map(slot => ({
    ...slot,
    end: makeEndTimeOverlap(slot.end),
    // Add one millisecond to label value in order to ignore the one ms
    // offset that's used in the data model.
    label: getTime(makeEndTimeOverlap(slot.end)),
  }));

  return (
    <div className={rootClass}>
      <div className={classes.fieldGrid}>
        <div className="hds-text-input">
          <label className="hds-text-input__label" htmlFor={startId}>
            {t('ResourceKeyboardSlotPicker.startTimeLabel')}
          </label>
          <select
            className="hds-text-input__input"
            id={startId}
            onChange={handleStartTimeChange}
            onFocus={handleStartTimeFocus}
            style={inlineStyles}
            value={selectedTime.start || ''}
          >
            <option value="" />
            {startDropdownOptions.map(option => (
              <option
                disabled={getIsOptionDisabled(option)}
                key={option.label}
                value={option.start}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hds-text-input">
          <label className="hds-text-input__label" htmlFor={endId}>
            {t('ResourceKeyboardSlotPicker.endTimeLabel')}
          </label>
          <select
            className="hds-text-input__input"
            id={endId}
            onChange={handleEndTimeChange}
            style={inlineStyles}
            value={selectedTime.end || ''}
          >
            <option value="" />
            {endDropdownOptions.map(option => (
              <option
                disabled={getIsOptionDisabled(option)}
                key={option.label}
                value={option.end}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

ResourcePageKeyboardTimePicker.propTypes = {
  slotSize: PropTypes.string,
  reservations: PropTypes.array,
  onTimeChange: PropTypes.func.isRequired,
  selectedTime: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  t: PropTypes.func.isRequired,
  maxPeriod: PropTypes.string.isRequired,
  minPeriod: PropTypes.string.isRequired,
  slots: PropTypes.array,
  defaultStartTime: PropTypes.string,
};

export default injectT(ResourcePageKeyboardTimePicker);
