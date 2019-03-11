import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { shallowWithIntl } from 'utils/testUtils';
import TopNavbar from './TopNavbar';

describe('shared/top-navbar/TopNavbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      currentLanguage: 'fi',
      isLoggedIn: false,
      userName: 'Luke Skywalker',
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

    test('has changeLocale as onSelect prop', () => {
      const changeLocale = () => null;
      const actual = getLanguageNavWrapper({ changeLocale }).prop('onSelect');
      expect(actual).toBe(changeLocale);
    });

    test('renders MenuItems for other languages', () => {
      const currentLanguage = 'fi';
      const menuItems = getLanguageNavWrapper({ currentLanguage }).find(MenuItem);
      expect(menuItems).toHaveLength(2);
      expect(menuItems.at(0).prop('eventKey')).toBe('en');
      expect(menuItems.at(1).prop('eventKey')).toBe('sv');
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
      const userNavDropDown = getLoggedInNotAdminWrapper().find('#user-nav-dropdown');
      expect(userNavDropDown).toHaveLength(1);
      expect(userNavDropDown.at(0).prop('title')).toBe(props.userName);
    });

    test('renders a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getLoggedInNotAdminWrapper()
        .find(MenuItem)
        .filter({ href: logoutHref });
      expect(logoutLink).toHaveLength(1);
    });

    test('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper()
        .find(NavItem)
        .filter('#app-Navbar__login');
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
      const loginLink = wrapper.find(NavItem).filter('#app-Navbar__login');
      expect(loginLink).toHaveLength(1);
      expect(loginLink.at(0).prop('onClick')).toBe(wrapper.instance().handleLoginClick);
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
