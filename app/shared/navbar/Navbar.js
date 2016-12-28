import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import Logo from 'shared/logo';
import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

function Navbar(props) {
  const {
    changeLocale,
    clearSearchResults,
    currentLanguage,
    isAdmin,
    isLoggedIn,
    t,
    userName,
  } = props;

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
              <Glyphicon glyph="search" /> {t('Navbar.search')}
            </NavItem>
          </LinkContainer>
        </Nav>

        <Nav navbar pullRight>
          {isAdmin && (
            <LinkContainer to="/admin-resources">
              <NavItem>
                {t('Navbar.adminResources')}
              </NavItem>
            </LinkContainer>
          )}
          {isLoggedIn && (
            <LinkContainer to="/my-reservations">
              <NavItem>
                {t('Navbar.userResources')}
              </NavItem>
            </LinkContainer>
          )}
          {isLoggedIn && (
            <NavDropdown id="user-dropdown" title={userName}>
              <MenuItem href={`/logout?next=${window.location.origin}`}>
                {t('Navbar.logout')}
              </MenuItem>
            </NavDropdown>
          )}
          {!isLoggedIn && (
            <NavItem href="/login">
              {t('Navbar.login')}
            </NavItem>
          )}
        </Nav>

        {/* Language nav is placed here so it is in the bottom in the navbar on mobile */}
        <Nav id="language-nav" onSelect={changeLocale}>
          {currentLanguage !== 'en' && <NavItem eventKey="en">EN</NavItem>}
          {currentLanguage !== 'fi' && <NavItem eventKey="fi">FI</NavItem>}
          {currentLanguage !== 'sv' && <NavItem eventKey="sv">SV</NavItem>}
        </Nav>
      </RBNavbar.Collapse>
    </RBNavbar>
  );
}

Navbar.propTypes = {
  changeLocale: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

export default injectT(Navbar);
