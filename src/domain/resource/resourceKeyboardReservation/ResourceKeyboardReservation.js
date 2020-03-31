import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import injectT from '../../../../app/i18n/injectT';
import APP from '../../../../app/constants/AppConstants';
import { getOpeningHours } from '../../../../app/utils/resourceUtils';
import { getSlots, getNextFreeSlot } from './resourceKeyboardSlotPickerUtils';
import ResourceKeyboardSlotPicker from './ResourceKeyboardSlotPicker';

const DATE_INPUT_ID = 'kb-reservation-date';

const ResourceKeyboardReservation = ({
  selectedDate,
  onDateChange,
  onTimeChange,
  resource,
  selectedTime,
  t,
}) => {
  const minDate = moment().format(APP.DATE_FORMAT);
  const { opens, closes } = getOpeningHours(resource, selectedDate);
  const slots = getSlots(opens, closes, resource.slotSize);
  const defaultStartTime = getNextFreeSlot(slots, resource.reservations).start;

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    const nextDateInMs = new Date(nextDate).setHours(0, 0, 0, 0);
    const minDateInMs = new Date(minDate).setHours(0, 0, 0, 0);
    const isBeforeMinDate = nextDateInMs >= minDateInMs;

    // Here we brutishly just don't allow past time to be inputted. A
    // better approach would be to have an error message of sorts that's
    // accessible to screen readers.
    if (isBeforeMinDate) {
      onTimeChange({ start: null, end: null });
      onDateChange(nextDate);
    }
  };

  return (
    <>
      <div className="app-ResourceKeyboardReservation__form-group">
        <div className="hds-text-input">
          <label className="hds-text-input__label" htmlFor={DATE_INPUT_ID}>
            {t('ResourceKeyboardReservation.dateLabel')}
          </label>
          <div className="hds-text-input__input-wrapper">
            <input
              className="hds-text-input__input"
              id={DATE_INPUT_ID}
              min={minDate}
              onChange={handleDateChange}
              type="date"
              value={selectedDate}
            />
          </div>
        </div>
      </div>
      <div className="app-ResourceKeyboardReservation__form-group">
        <ResourceKeyboardSlotPicker
          defaultStartTime={defaultStartTime}
          maxPeriod={resource.maxPeriod}
          minPeriod={resource.minPeriod}
          onTimeChange={onTimeChange}
          reservations={resource.reservations}
          selectedTime={selectedTime}
          slots={slots}
          slotSize={resource.slotSize}
        />
      </div>
    </>
  );
};

ResourceKeyboardReservation.propTypes = {
  selectedDate: PropTypes.string,
  selectedTime: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  onDateChange: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceKeyboardReservation);
