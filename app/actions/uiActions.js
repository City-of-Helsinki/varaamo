import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const changeReservationDate = createAction(types.CHANGE_RESERVATION_DATE);
const changeSearchFilters = createAction(types.CHANGE_SEARCH_FILTERS);

export default {
  changeReservationDate,
  changeSearchFilters,
};
