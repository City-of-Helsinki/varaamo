import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const changeSearchFilters = createAction(types.CHANGE_SEARCH_FILTERS);

export default {
  changeSearchFilters,
};
