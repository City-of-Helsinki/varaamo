import rootReducer from 'reducers/index';

export default {
  getInitialState,
};

function getInitialState() {
  return rootReducer(undefined, {});
}
