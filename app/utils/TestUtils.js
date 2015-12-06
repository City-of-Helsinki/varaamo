import rootReducer from 'reducers/index';

export default {
  getDefaultRouterProps,
  getInitialState,
};

function getDefaultRouterProps() {
  return {
    location: {
      query: {},
    },
    params: {},
  };
}

function getInitialState() {
  const initialState = rootReducer(undefined, {});
  const defaults = {
    router: {
      location: {
        query: {},
      },
    },
  };

  return Object.assign({}, initialState, defaults);
}
