import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';

function fetchAuthState() {
  const params = { t: +new Date() };
  return {
    [CALL_API]: {
      types: [
        types.API.AUTH_GET_REQUEST,
        types.API.AUTH_GET_SUCCESS,
        types.API.AUTH_GET_ERROR,
      ],
      endpoint: `/auth?t=${params.t}`,
      method: 'GET',
      credentials: 'include',
    },
  };
}

function login() {
  return dispatch => new Promise((resolve) => {
    if (typeof window === 'undefined') {  // Not in DOM? Just try to get an user then and see how that goes.
      resolve(true);
      return;
    }
    const loginPopup = window.open(
      '/login',
      'varaamoLoginWindow',
      'location,scrollbars=on,width=720,height=700'
    );
    const timer = setInterval(() => {
      if (!loginPopup || loginPopup.closed) { // Is our login popup gone (if it opened at all)?
        clearInterval(timer);
        resolve(true);
        return;
      }
    }, 500);
  }).then(() => dispatch(fetchAuthState()));
}

export {
  fetchAuthState,
  login,
};
