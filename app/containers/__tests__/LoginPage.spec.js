import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import { UnconnectedLoginPage as LoginPage } from 'containers/LoginPage';

describe('Container: LoginPage', () => {
  const props = {
    actions: {
      login: simple.stub(),
      pushState: simple.stub(),
    },
  };
  const tree = sd.shallowRender(<LoginPage {...props} />);
  const instance = tree.getMountedInstance();

  it('should display "Kirjaudu sisään" -title inside h1 tags', () => {
    const h1Tree = tree.subTree('h1');

    expect(h1Tree.props.children).to.equal('Kirjaudu sisään');
  });

  describe('rendering Login button', () => {
    const buttonTrees = tree.everySubTree('Button');

    it('should render Button component', () => {
      expect(buttonTrees.length).to.equal(1);
    });

    it('should pass correct props to Button component', () => {
      const actualProps = buttonTrees[0].props;

      expect(actualProps.onClick).to.equal(instance.handleLogin);
    });
  });

  describe('handleLogin', () => {
    const payload = { userId: 'u-1' };
    instance.handleLogin(payload);

    it('should call login function with correct arguments', () => {
      expect(props.actions.login.callCount).to.equal(1);
      expect(props.actions.login.lastCall.args[0]).to.deep.equal(payload);
    });

    it('should redirect to home page', () => {
      expect(props.actions.pushState.callCount).to.equal(1);
      expect(props.actions.pushState.lastCall.args).to.deep.equal([null, '/']);
    });
  });
});
