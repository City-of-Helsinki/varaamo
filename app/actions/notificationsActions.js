import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const addNotification = createAction(types.UI.ADD_NOTIFICATION);

const hideNotification = createAction(types.UI.HIDE_NOTIFICATION);

export {
  addNotification,
  hideNotification,
};
