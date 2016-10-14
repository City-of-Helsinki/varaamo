import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import User from 'utils/fixtures/User';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Notifications from 'shared/notifications';
import { UnconnectedAppContainer as AppContainer } from './AppContainer';

describe('pages/AppContainer', () => {
  const user = User.build();
  const defaultProps = {
    actions: {
      clearSearchResults: simple.stub(),
      fetchUser: simple.stub(),
    },
    children: <div id="child-div" />,
    isAdmin: false,
    isLoggedIn: true,
    location: {},
    user: Immutable(user),
    userId: user.id,
  };

  function getWrapper(extraProps) {
    return shallow(<AppContainer {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    const wrapper = getWrapper();

    describe('Navbar', () => {
      const navbar = wrapper.find(Navbar);

      it('renders a Navbar component', () => {
        expect(navbar.length).to.equal(1);
      });

      it('passes correct props to Navbar component', () => {
        const actualProps = navbar.props();
        expect(actualProps.clearSearchResults).to.equal(defaultProps.actions.clearSearchResults);
        expect(actualProps.isAdmin).to.equal(defaultProps.isAdmin);
        expect(actualProps.isLoggedIn).to.equal(defaultProps.isLoggedIn);
        expect(actualProps.user).to.equal(defaultProps.user);
      });
    });

    it('renders Notifications', () => {
      const notifications = wrapper.find(Notifications);
      expect(notifications.length).to.equal(1);
    });

    describe('props.children', () => {
      it('renders props.children', () => {
        const children = wrapper.find('#child-div');
        expect(children.length).to.equal(1);
      });
    });

    it('renders a Footer component', () => {
      const footer = wrapper.find(Footer);
      expect(footer.length).to.equal(1);
    });
  });

  describe('componentDidMount', () => {
    describe('when user is not logged in', () => {
      it('does not fetch user data', () => {
        defaultProps.actions.fetchUser.reset();
        const instance = getWrapper({ user: {}, userId: null }).instance();
        instance.componentDidMount();
        expect(defaultProps.actions.fetchUser.callCount).to.equal(0);
      });
    });

    describe('when user is logged in', () => {
      it('fetches user data', () => {
        defaultProps.actions.fetchUser.reset();
        const instance = getWrapper().instance();
        instance.componentDidMount();
        expect(defaultProps.actions.fetchUser.callCount).to.equal(1);
        expect(defaultProps.actions.fetchUser.lastCall.args[0]).to.equal(user.id);
      });
    });
  });
});
