import { expect } from 'chai';
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
      return getWrapper(props).find('#language-nav');
    }

    it('is rendered', () => {
      expect(getLanguageNavWrapper()).to.have.length(1);
    });

    it('has changeLocale as onSelect prop', () => {
      const changeLocale = () => null;
      const actual = getLanguageNavWrapper({ changeLocale }).prop('onSelect');
      expect(actual).to.equal(changeLocale);
    });

    it('renders MenuItems for other languages', () => {
      const currentLanguage = 'fi';
      const menuItems = getLanguageNavWrapper({ currentLanguage }).find(MenuItem);
      expect(menuItems).to.have.length(2);
      expect(menuItems.at(0).prop('eventKey')).to.equal('en');
      expect(menuItems.at(1).prop('eventKey')).to.equal('sv');
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

    it('renders the name of the logged in user', () => {
      const userNavDropDown = getLoggedInNotAdminWrapper().find('#user-nav-dropdown');
      expect(userNavDropDown).to.have.length(1);
      expect(userNavDropDown.at(0).prop('title')).to.equal(props.userName);
    });

    it('renders a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = (
        getLoggedInNotAdminWrapper()
        .find(MenuItem)
        .filter({ href: logoutHref })
      );
      expect(logoutLink).to.have.length(1);
    });

    it('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper()
        .find(NavItem).filter('#app-Navbar__login');
      expect(loginLink).to.have.length(0);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper() {
      return getWrapper({ ...props });
    }

    it('renders a link to login page', () => {
      const wrapper = getNotLoggedInWrapper();
      const loginLink = wrapper.find(NavItem).filter('#app-Navbar__login');
      expect(loginLink).to.have.length(1);
      expect(loginLink.at(0).prop('onClick')).to.equal(wrapper.instance().handleLoginClick);
    });

    it('does not render a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getNotLoggedInWrapper().find(NavItem).filter({ href: logoutHref });
      expect(logoutLink).to.have.length(0);
    });
  });
});
