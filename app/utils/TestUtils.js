import { expect } from 'chai';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import merge from 'lodash/merge';
import set from 'lodash/set';

import rootReducer from 'reducers/index';

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

function getState(extraState = {}) {
  const state = getInitialState();
  const newState = {};

  forEach(Object.keys(extraState), (key) => {
    const mergedValue = merge({}, get(state, key), extraState[key]);
    set(newState, key, mergedValue);
  });
  return merge({}, state, newState);
}

function makeButtonTests(button, name, expectedText, expectedOnClickFunction) {
  it(`should be an ${name} button`, () => {
    expect(button.props().children).to.equal(expectedText);
  });

  it('clicking the button should call correct onClick function', () => {
    expectedOnClickFunction.reset();
    button.props().onClick();

    expect(expectedOnClickFunction.callCount).to.equal(1);
  });
}

export {
  getDefaultRouterProps,
  getInitialState,
  getState,
  makeButtonTests,
};
