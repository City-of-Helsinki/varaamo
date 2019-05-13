import types from 'constants/ActionTypes';
import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';

import Immutable from 'seamless-immutable';
import moment from 'moment';

import { getOpeningHours, getOpenReservations } from 'utils/resourceUtils';
import { getTimeSlots } from 'utils/timeUtils';

const initialState = Immutable({
  daySlots: [],
  selectedDaySlots: null,
  hoveredSlot: null,
  startSlot: null,
  endSlot: null,
  selectedSlots: []
});

function timeSlotsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.TIME_SLOT.CREATE_DAYS_SLOTS: {
      const { resourceDates, reservationsToEdit } = action.payload;

      const daySlots = resourceDates.map((resource) => {
        const { closes, opens } = getOpeningHours(resource);
        const period = resource.slotSize || DEFAULT_SLOT_SIZE;
        const reservations = getOpenReservations(resource);
        const generatedSlots = getTimeSlots(
          opens, closes, period, reservations, reservationsToEdit
        );

        if (generatedSlots.length) {
          return generatedSlots;
        }

        if (resource.openingHours && resource.openingHours.length) {
          const resourceDate = resource.openingHours[0].date;
          const start = moment(resourceDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
          return resourceDate ? [{ start }] : [];
        }

        return [];
      });

      return state.merge({ daySlots });
    }

    case types.UI.TIME_SLOT.CLEAR_TIME_SLOT_SELECTION: {
      return state.merge({ startSlot: null, endSlot: null });
    }

    case types.UI.TIME_SLOT.SELECT_TIME_SLOT: {
      const selectedSlot = action.payload;

      if (!state.startSlot) {
        return state.merge({ startSlot: selectedSlot });
      }
      return state.merge({ endSlot: selectedSlot });
    }

    case types.UI.TIME_SLOT.SELECT_DAY_SLOT: {
      const index = action.payload;

      return state.merge({ selectedDaySlot: state.daySlots[index] });
    }

    default:
      return state;
  }
}


export default timeSlotsReducer;
