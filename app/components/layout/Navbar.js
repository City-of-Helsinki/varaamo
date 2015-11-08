import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import {
  CollapsibleNav,
  Glyphicon,
  MenuItem,
  Navbar as RBNavbar,
  Nav,
  NavBrand,
  NavDropdown,
  NavItem,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import styles from './Navbar.styles';
import logoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.renderUserNav = this.renderUserNav.bind(this);
  }

  renderUserNav() {
    const { logout, user } = this.props;
    if (user && user.displayName) {
      return (
        <NavDropdown id="collapsible-navbar-dropdown" title={user.displayName}>
          <LinkContainer to="/my-reservations">
            <MenuItem>Omat varaukset</MenuItem>
          </LinkContainer>
          <MenuItem divider />
          <MenuItem onSelect={() => logout(user.id)}>Kirjaudu ulos</MenuItem>
        </NavDropdown>
      );
    }

    return (
      <NavItem href="/login">Kirjaudu sisään</NavItem>
    );
  }

  render() {
    return (
      <RBNavbar inverse toggleNavKey={0}>
        <NavBrand>
          <Link style={styles.navBrand} to={'/'}>
            <img
              alt="Helsingin vaakuna"
              src={logoSrc}
              style={styles.logo}
            />
            Respa
          </Link>
        </NavBrand>
        <CollapsibleNav eventKey={0}>
          <Nav navbar>
            <LinkContainer to="/search">
              <NavItem>
                <Glyphicon glyph="search" />
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav navbar eventKey={0} right>
            {this.renderUserNav()}
          </Nav>
        </CollapsibleNav>
      </RBNavbar>
    );
  }
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Radium(Navbar);
