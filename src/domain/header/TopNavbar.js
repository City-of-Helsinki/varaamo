import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';

import injectT from '../../../app/i18n/injectT';

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
      changeLocale, currentLanguage, isLoggedIn, t, userName,
    } = this.props;

    return (
      <Navbar className="app-TopNavbar" fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <span className="brand-logo" />
            </Link>
          </Navbar.Brand>
        </Navbar.Header>

        <Nav activeKey="none" pullRight>
          <NavDropdown
            className="app-TopNavbar__language"
            eventKey="lang"
            id="language-nav-dropdown"
            noCaret
            onSelect={changeLocale}
            title={currentLanguage}
          >
            {currentLanguage !== 'en' && <MenuItem eventKey="en">EN</MenuItem>}
            {currentLanguage !== 'fi' && <MenuItem eventKey="fi">FI</MenuItem>}
            {currentLanguage !== 'sv' && <MenuItem eventKey="sv">SV</MenuItem>}
          </NavDropdown>

          {isLoggedIn && (
            <NavDropdown
              className="app-TopNavbar__name"
              eventKey="lang"
              id="user-nav-dropdown"
              noCaret
              title={userName}
            >
              <MenuItem eventKey="logout" href={`/logout?next=${window.location.origin}`}>
                {t('Navbar.logout')}
              </MenuItem>
            </NavDropdown>
          )}

          {!isLoggedIn && (
            <NavItem id="app-TopNavbar__login" onClick={this.handleLoginClick}>
              {t('Navbar.login')}
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

export default injectT(TopNavbar);
