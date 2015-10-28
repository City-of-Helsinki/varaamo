import rootReducer from 'reducers/index';

export default {
  getInitialState,
};

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
