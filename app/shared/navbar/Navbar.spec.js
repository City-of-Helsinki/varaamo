import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';


import User from 'utils/fixtures/User';
import { getSearchPageUrl } from 'utils/searchUtils';
import Navbar from './Navbar';

describe('shared/navbar/Navbar', () => {
  describe('basic rendering', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isAdmin: false,
      isLoggedIn: true,
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('renders a link to home page', () => {
      const homePageLink = tree.subTreeLike('IndexLink', { to: '/' });
      expect(homePageLink).to.be.ok;
    });

    it('displays the logo of the service', () => {
      expect(tree.subTree('Logo')).to.be.ok;
    });

    it('renders a link to search page', () => {
      const searchLink = tree.subTreeLike('LinkContainer', { to: getSearchPageUrl() });
      expect(searchLink).to.be.ok;
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isAdmin: false,
      isLoggedIn: true,
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('renders a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');
      expect(navDropdownTrees.length).to.equal(1);
    });

    it('NavDropdown has the name of the logged in user as its title', () => {
      const expected = [props.user.firstName, props.user.lastName].join(' ');

      expect(tree.subTree('NavDropdown').props.title).to.equal(expected);
    });

    it('renders a link to my reservations page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.be.ok;
    });

    it('does not render a link to admin resources page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/admin-resources' });
      expect(myReservationsLink).to.be.false;
    });

    it('renders a logout link', () => {
      const logoutLink = tree.subTreeLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.be.ok;
    });

    it('does not render a link to login page', () => {
      const loginLink = tree.subTreeLike('LinkContainer', { to: '/login' });
      expect(loginLink).to.equal(false);
    });
  });

  describe('if user is logged in and is an admin', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isAdmin: true,
      isLoggedIn: true,
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('renders a link to admin resources page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/admin-resources' });
      expect(myReservationsLink).to.be.ok;
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      clearSearchResults: simple.stub(),
      isAdmin: false,
      isLoggedIn: false,
      user: {},
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('does not render a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');

      expect(navDropdownTrees.length).to.equal(0);
    });

    it('renders a link to login page', () => {
      const loginLink = tree.subTreeLike('NavItem', { href: '/login' });
      expect(loginLink).to.be.ok;
    });

    it('does not render a logout link', () => {
      const logoutLink = tree.subTreeLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.equal(false);
    });

    it('does not render a link to my reservations page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.equal(false);
    });

    it('does not render a link to admin resources page', () => {
      const myReservationsLink = tree.subTreeLike('LinkContainer', { to: '/admin-resources' });
      expect(myReservationsLink).to.be.false;
    });
  });
});
