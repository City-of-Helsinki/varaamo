import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import TopNavbar from '../TopNavbar';
import TabbableNavDropdown from '../../../../app/shared/tabbable-nav-dropdown/TabbableNavDropdown';
import TappableNavItem from '../../../../app/shared/tabbable-nav-dropdown/TabbableNavItem';

describe('shared/top-navbar/TopNavbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      currentLanguage: 'fi',
      isLoggedIn: false,
      userName: 'Luke Skywalker',
      fontSize: 'fontSizeSmall',
      setFontSize: () => {},
    };
    return shallowWithIntl(<TopNavbar {...defaults} {...props} />);
  }

  describe('language nav', () => {
    function getLanguageNavWrapper(props) {
      return getWrapper(props).find('#language-nav-dropdown');
    }

    test('is rendered', () => {
      expect(getLanguageNavWrapper()).toHaveLength(1);
    });

    test.skip('renders MenuItems for other languages', () => {
      const currentLanguage = 'fi';
      const wrapper = getLanguageNavWrapper({ currentLanguage });

      wrapper.find(TabbableNavDropdown).simulate('click');
      const menuItems = wrapper.find(TappableNavItem);

      expect(menuItems).toHaveLength(2);
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper() {
      return getWrapper({ ...props });
    }

    test('renders the name of the logged in user', () => {
      const userNavDropDown = getLoggedInNotAdminWrapper().find(
        '#user-nav-dropdown'
      );
      expect(userNavDropDown).toHaveLength(1);
      const renderToggle = userNavDropDown.at(0).dive().children().first();
      expect(renderToggle.prop('children')).toEqual(props.userName);
    });

    test.skip('renders a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const userNavDropdown = getLoggedInNotAdminWrapper()
        .find('#user-nav-dropdown')
        .dive();
      const renderToggle = userNavDropdown.children().first();

      renderToggle.simulate('click', { preventDefault: () => {} });

      const logoutLink = userNavDropdown
        .find(TappableNavItem)
        .filter({ href: logoutHref });

      expect(logoutLink).toHaveLength(1);
    });

    test('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper()
        .find(NavItem)
        .filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(0);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper() {
      return getWrapper({ ...props });
    }

    test('renders a link to login page', () => {
      const wrapper = getNotLoggedInWrapper();
      const loginLink = wrapper.find(NavItem).filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(1);
      expect(loginLink.at(0).prop('onClick')).toBe(
        wrapper.instance().handleLoginClick
      );
    });

    test('does not render a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getNotLoggedInWrapper()
        .find(NavItem)
        .filter({ href: logoutHref });
      expect(logoutLink).toHaveLength(0);
    });
  });
});
