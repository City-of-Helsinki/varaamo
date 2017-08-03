import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import ResourceMap from 'shared/resource-map';
import SideNavbar from 'shared/side-navbar';
import Notifications from 'shared/notifications';
import { getState } from 'utils/testUtils';
import { selector, UnconnectedAppContainer as AppContainer } from './AppContainer';


describe('pages/AppContainer', () => {
  function getWrapper(props) {
    const defaults = {
      children: <div id="child-div" />,
      fetchUser: () => null,
      location: {},
      searchResultIds: Immutable([]),
      selectedUnitId: '123',
      showMap: false,
      userId: null,
    };
    return shallow(<AppContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    const searchResultIds = ['resource-1', 'resourece-2'];

    function getSelected() {
      const state = getState({
        auth: {
          userId: 'u-1',
        },
        'ui.search.results': searchResultIds,
      });
      return selector(state);
    }

    it('returns userId from state', () => {
      expect(getSelected().userId).to.equal('u-1');
    });

    it('returns searchResultIds', () => {
      expect(getSelected().searchResultIds).to.deep.equal(searchResultIds);
    });

    it('returns showMap', () => {
      expect(getSelected().showMap).to.exist;
    });

    it('returns selectedUnitId', () => {
      expect(getSelected().selectedUnitId).to.equal(null);
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

    it('renders a ResourceMap with correct props', () => {
      const props = {
        searchResultIds: Immutable(['resource-1', 'resource-2']),
        selectedUnitId: '123',
      };
      const resourceMap = getWrapper(props).find(ResourceMap);
      expect(resourceMap).to.have.length(1);
      expect(resourceMap.prop('showMap')).to.equal(false);
      expect(resourceMap.prop('resourceIds')).to.deep.equal(props.searchResultIds);
      expect(resourceMap.prop('selectedUnitId')).to.equal(props.selectedUnitId);
    });

    it('passes showMap prop to ResourceMap', () => {
      const resourceMap = getWrapper({ showMap: true }).find(ResourceMap);
      expect(resourceMap.prop('showMap')).to.equal(true);
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
