import React, { Component, PropTypes } from 'react';
import {
  MenuItem,
  Navbar as RBNavbar,
  Nav,
  NavBrand,
  NavDropdown,
  NavItem,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.renderUserNav = this.renderUserNav.bind(this);
  }

  renderUserNav() {
    const { logout, user } = this.props;

    if (user && user.name) {
      return (
        <NavDropdown id="collapsible-navbar-dropdown" title={user.name}>
          <LinkContainer to="/my-reservations">
            <MenuItem>Omat varaukset</MenuItem>
          </LinkContainer>
          <MenuItem divider />
          <MenuItem onSelect={logout}>Kirjaudu ulos</MenuItem>
        </NavDropdown>
      );
    }

    return (
      <LinkContainer to="/login">
        <NavItem>Kirjaudu sisään</NavItem>
      </LinkContainer>
    );
  }

  render() {
    return (
      <RBNavbar toggleNavKey={0}>
        <NavBrand><Link to={'/'}>Respa</Link></NavBrand>
        <Nav eventKey={0} right>
          <LinkContainer to="/search">
            <NavItem>Haku</NavItem>
          </LinkContainer>
          {this.renderUserNav()}
        </Nav>
      </RBNavbar>
    );
  }
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Navbar;
