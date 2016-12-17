import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';

import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Notifications from 'shared/notifications';
import { selector, UnconnectedAppContainer as AppContainer } from './AppContainer';

describe('pages/AppContainer', () => {
  function getWrapper(props) {
    const defaults = {
      children: <div id="child-div" />,
      fetchUser: () => null,
      location: {},
      userId: null,
    };
    return shallow(<AppContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    it('returns userId from state', () => {
      const state = {
        auth: {
          userId: 'u-1',
        },
      };
      const selected = selector(state);
      expect(selected.userId).to.equal('u-1');
    });
  });

  describe('render', () => {
    const wrapper = getWrapper();

    it('renders Navbar', () => {
      expect(getWrapper().find(Navbar)).to.have.length(1);
    });

    it('renders Notifications', () => {
      expect(getWrapper().find(Notifications)).to.have.length(1);
    });

    it('renders props.children', () => {
      const children = wrapper.find('#child-div');
      expect(children).to.have.length(1);
    });

    it('renders a Footer component', () => {
      expect(getWrapper().find(Footer)).to.have.length(1);
    });
  });

  describe('componentDidMount', () => {
    describe('when user is not logged in', () => {
      it('does not fetch user data', () => {
        const fetchUser = simple.mock();
        const instance = getWrapper({ fetchUser, userId: null }).instance();
        instance.componentDidMount();
        expect(fetchUser.callCount).to.equal(0);
      });
    });

    describe('when user is logged in', () => {
      it('fetches user data', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentDidMount();
        expect(fetchUser.callCount).to.equal(1);
        expect(fetchUser.lastCall.arg).to.equal(userId);
      });
    });
  });
});
