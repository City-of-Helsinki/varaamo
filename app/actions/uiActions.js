import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const changePurposeFilter = createAction(types.CHANGE_PURPOSE_FILTER);

export default {
  changePurposeFilter,
};
