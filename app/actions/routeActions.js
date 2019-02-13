import { createAction } from 'redux-actions';

export const updateRoute = componentName =>
  createAction(`ENTER_OR_CHANGE_${componentName.toUpperCase()}_PAGE`);
