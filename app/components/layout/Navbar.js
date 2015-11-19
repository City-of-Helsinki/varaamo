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
    const { isLoggedIn, logout, user } = this.props;
    const name = [user.firstName, user.lastName].join(' ');

    if (isLoggedIn) {
      return (
        <NavDropdown id="collapsible-navbar-dropdown" title={name}>
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
    const { clearSearchResults } = this.props;

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
              <NavItem onClick={clearSearchResults}>
                <Glyphicon glyph="search" /> Haku
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>Tietoa palvelusta</NavItem>
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
  clearSearchResults: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Radium(Navbar);
