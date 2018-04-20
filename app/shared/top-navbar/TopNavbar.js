import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import iconGlobe from 'hel-icons/dist/shapes/globe.svg';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import { injectT } from 'i18n';

class TopNavbar extends Component {
  static propTypes = {
    changeLocale: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
  };

  handleLoginClick() {
    const next = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/login?next=${next}`);
  }

  render() {
    const {
      changeLocale,
      currentLanguage,
      isLoggedIn,
      t,
      userName,
    } = this.props;

    return (
      <Navbar className="app-TopNavbar" fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <span className="brand-logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey="none" id="user-nav" pullRight>
            <NavItem disabled>
              <img className="app-TopNavbar__icon" role="presentation" src={iconUser} />
            </NavItem>
            {isLoggedIn && (
              <NavDropdown eventKey="lang" id="user-nav-dropdown" noCaret title={userName}>
                <MenuItem
                  eventKey="logout"
                  href={`/logout?next=${window.location.origin}`}
                >
                  {t('Navbar.logout')}
                </MenuItem>
              </NavDropdown>
            )}
            {!isLoggedIn && (
              <NavItem id="app-Navbar__login" onClick={this.handleLoginClick}>
                {t('Navbar.login')}
              </NavItem>
            )}
          </Nav>
          <Nav activeKey="none" id="language-nav" onSelect={changeLocale} pullRight>
            <NavItem disabled>
              <img className="app-TopNavbar__icon" role="presentation" src={iconGlobe} />
            </NavItem>
            <NavDropdown eventKey="lang" id="language-nav-dropdown" noCaret title={currentLanguage}>
              {currentLanguage !== 'en' && <MenuItem eventKey="en">EN</MenuItem>}
              {currentLanguage !== 'fi' && <MenuItem eventKey="fi">FI</MenuItem>}
              {currentLanguage !== 'sv' && <MenuItem eventKey="sv">SV</MenuItem>}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default injectT(TopNavbar);
