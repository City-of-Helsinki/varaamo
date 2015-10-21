import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const login = createAction(types.API.LOGIN);
const logout = createAction(types.API.LOGOUT);

export default {
  login,
  logout,
};
