import trim from 'lodash/trim';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import Logo from 'shared/logo';
import { getSearchPageUrl } from 'utils/searchUtils';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.renderUserNav = this.renderUserNav.bind(this);
  }

  renderUserNav() {
    const { isLoggedIn, user } = this.props;
    let name;
    if (user.firstName || user.lastName) {
      name = trim([user.firstName, user.lastName].join(' '));
    } else {
      name = user.emails && user.emails.length ? user.emails[0].value : '';
    }

    if (isLoggedIn) {
      return (
        <NavDropdown id="collapsible-navbar-dropdown" title={name}>
          <MenuItem href={`/logout?next=${window.location.origin}`}>
            Kirjaudu ulos
          </MenuItem>
        </NavDropdown>
      );
    }

    return (
      <NavItem href="/login">Kirjaudu sisään</NavItem>
    );
  }

  render() {
    const { isAdmin, isLoggedIn, clearSearchResults } = this.props;

    return (
      <RBNavbar inverse>
        <RBNavbar.Header>
          <RBNavbar.Brand>
            <IndexLink to="/">
              <Logo />
              Varaamo
            </IndexLink>
          </RBNavbar.Brand>
          <RBNavbar.Toggle />
        </RBNavbar.Header>
        <RBNavbar.Collapse>
          <Nav navbar>
            <LinkContainer to={getSearchPageUrl()}>
              <NavItem onClick={clearSearchResults}>
                <Glyphicon glyph="search" /> Haku
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav navbar pullRight>
            {isAdmin && (
              <LinkContainer to="/admin-resources">
                <NavItem>Omat tilat</NavItem>
              </LinkContainer>
            )}
            {isLoggedIn && (
              <LinkContainer to="/my-reservations">
                <NavItem>Omat varaukset</NavItem>
              </LinkContainer>
            )}
            {this.renderUserNav()}
          </Nav>
        </RBNavbar.Collapse>
      </RBNavbar>
    );
  }
}

Navbar.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default Navbar;
