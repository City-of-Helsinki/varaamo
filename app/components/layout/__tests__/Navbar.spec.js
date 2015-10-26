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
      logout: simple.stub(),
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should render a Navbar component', () => {
      const navbarTrees = tree.everySubTree('Navbar');

      expect(navbarTrees.length).to.equal(1);
    });

    describe('rendering NavBrand', () => {
      const navBrandTrees = tree.everySubTree('NavBrand');
      it('should render a NavBrand component', () => {
        expect(navBrandTrees.length).to.equal(1);
      });

      it('should contain a link to home page', () => {
        const linkTree = navBrandTrees[0].subTree('Link');

        expect(linkTree.props.to).to.equal('/');
      });

      it('should display the logo of the service', () => {
        const imgTrees = navBrandTrees[0].everySubTree('img');

        expect(imgTrees.length).to.equal(1);
      });

      it('should display text "Respa"', () => {
        const linkTree = navBrandTrees[0].subTree('Link');

        expect(linkTree.props.children).to.contain('Respa');
      });
    });

    it('should render a link to search page', () => {
      const searchLink = tree.findComponentLike('LinkContainer', { to: '/search' });
      expect(searchLink).to.be.ok;
    });
  });

  describe('if user is logged in', () => {
    const props = {
      logout: simple.stub(),
      user: Immutable(User.build()),
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should render a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');
      expect(navDropdownTrees.length).to.equal(1);
    });

    it('NavDropdown should have the name of logged in user as its title', () => {
      expect(tree.subTree('NavDropdown').props.title).to.equal(props.user.name);
    });

    it('should render a link to my reservations page', () => {
      const myReservationsLink = tree.findComponentLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.be.ok;
    });

    it('should render a logout link', () => {
      const logoutLink = tree.findComponentLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.be.ok;
    });

    it('should not render a link to login page', () => {
      const loginLink = tree.findComponentLike('LinkContainer', { to: '/login' });
      expect(loginLink).to.equal(false);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      logout: simple.stub(),
      user: {},
    };
    const tree = sd.shallowRender(<Navbar {...props} />);

    it('should not render a NavDropdown', () => {
      const navDropdownTrees = tree.everySubTree('NavDropdown');

      expect(navDropdownTrees.length).to.equal(0);
    });

    it('should render a link to login page', () => {
      const loginLink = tree.findComponentLike('LinkContainer', { to: '/login' });
      expect(loginLink).to.be.ok;
    });

    it('should not render a logout link', () => {
      const logoutLink = tree.findComponentLike('MenuItem', { children: 'Kirjaudu ulos' });
      expect(logoutLink).to.equal(false);
    });

    it('should not render a link to my reservations page', () => {
      const myReservationsLink = tree.findComponentLike('LinkContainer', { to: '/my-reservations' });
      expect(myReservationsLink).to.equal(false);
    });
  });
});
