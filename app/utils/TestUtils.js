import { expect } from 'chai';

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
  makeButtonTests,
};
