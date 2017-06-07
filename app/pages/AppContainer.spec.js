import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';

import SideNavbar from 'shared/side-navbar';
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

    it('renders SideNavbar', () => {
      expect(getWrapper().find(SideNavbar)).to.have.length(1);
    });

    it('renders Notifications', () => {
      expect(getWrapper().find(Notifications)).to.have.length(1);
    });

    it('renders props.children', () => {
      const children = wrapper.find('#child-div');
      expect(children).to.have.length(1);
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

  describe('componentWillUpdate', () => {
    describe('when userId does not change', () => {
      it('does not fetch user data', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId });
        expect(fetchUser.callCount).to.equal(0);
      });
    });

    describe('when userId does change', () => {
      it('fetches user data if new userId is not null', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const newId = 'u-99';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId: newId });
        expect(fetchUser.callCount).to.equal(1);
        expect(fetchUser.lastCall.arg).to.equal(newId);
      });

      it('does not fetch user data if new userId is null', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const newId = null;
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId: newId });
        expect(fetchUser.callCount).to.equal(0);
      });
    });
  });
});
