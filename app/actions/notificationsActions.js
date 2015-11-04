import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

const hideNotification = createAction(types.UI.HIDE_NOTIFICATION);

export default {
  hideNotification,
};
