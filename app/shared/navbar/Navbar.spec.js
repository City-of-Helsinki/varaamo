import { expect } from 'chai';
import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';
import simple from 'simple-mock';

import { getSearchPageUrl } from 'utils/searchUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Navbar from './Navbar';


function createNavItemsTest(wrapperFunction) {
  it('NavItems have onClick prop to onNavItemClick if not href', () => {
    const onNavItemClick = simple.mock();
    const navItems = wrapperFunction({ onNavItemClick }).find(NavItem);
    navItems.forEach((navItem) => {
      onNavItemClick.reset();
      if (navItem.prop('id') !== 'app-Navbar__login') {
        navItem.prop('onClick')();
        expect(onNavItemClick.callCount).to.equal(1);
      }
    });
  });
}

describe('shared/navbar/Navbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      clearSearchResults: () => null,
      currentLanguage: 'fi',
      isAdmin: false,
      isLoggedIn: false,
      userName: 'Luke Skywalker',
    };
    return shallowWithIntl(<Navbar {...defaults} {...props} />);
  }

  createNavItemsTest(getWrapper);

  it('renders a link to search page', () => {
    const searchLink = getWrapper().find(LinkContainer).filter({ to: getSearchPageUrl() });
    expect(searchLink).to.have.length(1);
  });

  it('contains a link to about page', () => {
    const link = getWrapper().find(LinkContainer).filter({ to: '/about' });
    expect(link).to.have.length(1);
  });

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

    it('renders NavItems for other languages', () => {
      const currentLanguage = 'fi';
      const navItems = getLanguageNavWrapper({ currentLanguage }).find(NavItem);
      expect(navItems).to.have.length(2);
      expect(navItems.at(0).prop('eventKey')).to.equal('en');
      expect(navItems.at(0).find('img')).to.have.length(1);
      expect(navItems.at(1).prop('eventKey')).to.equal('sv');
      expect(navItems.at(1).find('img')).to.have.length(1);
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    createNavItemsTest(getLoggedInNotAdminWrapper);

    it('renders a h4 with the name of the logged in user', () => {
      const actual = getLoggedInNotAdminWrapper().find('h4');
      expect(actual.text()).to.equal(props.userName);
    });

    it('renders a link to my reservations page', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/my-reservations' });
      expect(myReservationsLink).to.have.length(1);
    });

    it('does not render a link to admin resources page', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).to.have.length(0);
    });

    it('renders a logout link in header', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = (
        getLoggedInNotAdminWrapper()
        .find(NavItem)
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

  describe('if user is logged in and is an admin', () => {
    const props = {
      isAdmin: true,
      isLoggedIn: true,
    };
    function getLoggedInAdminWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    createNavItemsTest(getLoggedInAdminWrapper);

    it('renders a link to admin resources page', () => {
      const myReservationsLink = getLoggedInAdminWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).to.have.length(1);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    createNavItemsTest(getNotLoggedInWrapper);

    it('renders a h4 with the header message', () => {
      const actual = getNotLoggedInWrapper().find('h2');
      expect(actual.text()).to.equal('Navbar.header');
    });

    it('renders a link to login page', () => {
      const loginLink = getNotLoggedInWrapper()
        .find(NavItem).filter('#app-Navbar__login');
      expect(loginLink).to.have.length(1);
    });

    it('does not render a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getNotLoggedInWrapper().find(NavItem).filter({ href: logoutHref });
      expect(logoutLink).to.have.length(0);
    });

    it('does not render a link to my reservations page', () => {
      const myReservationsLink = getNotLoggedInWrapper()
        .find(LinkContainer).filter({ to: '/my-reservations' });
      expect(myReservationsLink).to.have.length(0);
    });

    it('does not render a link to admin resources page', () => {
      const myReservationsLink = getNotLoggedInWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).to.have.length(0);
    });
  });
});
