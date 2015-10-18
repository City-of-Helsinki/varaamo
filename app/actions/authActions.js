import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const login = createAction(types.LOGIN);
const logout = createAction(types.LOGOUT);

export default {
  login,
  logout,
};
