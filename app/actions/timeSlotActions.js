import types from 'constants/ActionTypes';

import { createAction } from 'redux-actions';

const createDaysSlots = createAction(types.UI.TIME_SLOT.CREATE_DAYS_SLOTS);
const clearTimeSlotSelection = createAction(types.UI.TIME_SLOT.CLEAR_TIME_SLOT_SELECTION);
const selectTimeSlot = createAction(types.UI.TIME_SLOT.SELECT_TIME_SLOT);

export {
  createDaysSlots,
  clearTimeSlotSelection,
  selectTimeSlot
};
