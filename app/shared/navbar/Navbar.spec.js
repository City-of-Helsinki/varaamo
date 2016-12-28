import { expect } from 'chai';
import React from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import Logo from 'shared/logo';
import { getSearchPageUrl } from 'utils/searchUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Navbar from './Navbar';

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

  it('renders a link to home page', () => {
    const homePageLink = getWrapper().find(IndexLink);
    expect(homePageLink).to.have.length(1);
  });

  it('displays the logo of the service', () => {
    expect(getWrapper().find(Logo)).to.have.length(1);
  });

  it('renders a link to search page', () => {
    const searchLink = getWrapper().find(LinkContainer).filter({ to: getSearchPageUrl() });
    expect(searchLink).to.have.length(1);
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
      expect(navItems.at(0).prop('children')).to.equal('EN');
      expect(navItems.at(1).prop('children')).to.equal('SV');
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper() {
      return getWrapper(props);
    }

    it('renders a NavDropdown for logged in user', () => {
      const navDropdown = getLoggedInNotAdminWrapper().find('#user-dropdown');
      expect(navDropdown).to.have.length(1);
    });

    it('NavDropdown has the name of the logged in user as its title', () => {
      const actual = getLoggedInNotAdminWrapper().find('#user-dropdown').prop('title');
      expect(actual).to.equal(props.userName);
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

    it('renders a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getLoggedInNotAdminWrapper().find(MenuItem).filter({ href: logoutHref });
      expect(logoutLink).to.have.length(1);
    });

    it('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper().find(NavItem).filter({ href: '/login' });
      expect(loginLink).to.have.length(0);
    });
  });

  describe('if user is logged in and is an admin', () => {
    const props = {
      isAdmin: true,
      isLoggedIn: true,
    };
    function getLoggedInAdminWrapper() {
      return getWrapper(props);
    }

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
    function getNotLoggedInWrapper() {
      return getWrapper(props);
    }

    it('does not render a NavDropdown for logged in user', () => {
      const navDropdown = getNotLoggedInWrapper().find('#user-dropdown');
      expect(navDropdown).to.have.length(0);
    });

    it('renders a link to login page', () => {
      const loginLink = getNotLoggedInWrapper().find(NavItem).filter({ href: '/login' });
      expect(loginLink).to.have.length(1);
    });

    it('does not render a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getNotLoggedInWrapper().find(MenuItem).filter({ href: logoutHref });
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
