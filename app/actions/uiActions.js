import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const changeReservationDate = createAction(types.CHANGE_RESERVATION_DATE);
const changeSearchFilters = createAction(types.CHANGE_SEARCH_FILTERS);
const toggleTimeSlot = createAction(types.TOGGLE_TIME_SLOT);

export default {
  changeReservationDate,
  changeSearchFilters,
  toggleTimeSlot,
};
