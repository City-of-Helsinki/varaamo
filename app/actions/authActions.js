import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const logout = createAction(types.API.LOGOUT);

export default {
  logout,
};
