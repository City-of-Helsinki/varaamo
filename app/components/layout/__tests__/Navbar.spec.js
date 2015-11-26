import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Navbar from 'components/layout/Navbar';
import User from 'fixtures/User';

describe('Component: layout/Navbar', () => {
  describe('basic rendering', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isLoggedIn: true,
      logout: simple.stub(),
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should render a link to home page', () => {
      const homePageLink = tree.subTreeLike('Link', { to: '/' });
      expect(homePageLink).to.be.ok;
    });

    it('should display the logo of the service', () => {
      expect(tree.subTree('img')).to.be.ok;
    });

    it('should render a link to search page', () => {
      const searchLink = tree.subTreeLike('LinkContainer', { to: '/search' });
      expect(searchLink).to.be.ok;
    });
  });

  describe('if user is logged in', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isLoggedIn: true,
      logout: simple.stub(),
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should render a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');
      expect(navDropdownTrees.length).to.equal(1);
    });

    it('NavDropdown should have the name of logged in user as its title', () => {
      const expected = [props.user.firstName, props.user.lastName].join(' ');

      expect(tree.subTree('NavDropdown').props.title).to.equal(expected);
    });

    it('should render a link to my reservations page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.be.ok;
    });

    it('should render a logout link', () => {
      const logoutLink = tree.subTreeLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.be.ok;
    });

    it('should not render a link to login page', () => {
      const loginLink = tree.subTreeLike('LinkContainer', { to: '/login' });
      expect(loginLink).to.equal(false);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isLoggedIn: false,
      logout: simple.stub(),
      user: {},
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should not render a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');

      expect(navDropdownTrees.length).to.equal(0);
    });

    it('should render a link to login page', () => {
      const loginLink = tree.subTreeLike('NavItem', { href: '/login' });
      expect(loginLink).to.be.ok;
    });

    it('should not render a logout link', () => {
      const logoutLink = tree.subTreeLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.equal(false);
    });

    it('should not render a link to my reservations page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.equal(false);
    });
  });
});
