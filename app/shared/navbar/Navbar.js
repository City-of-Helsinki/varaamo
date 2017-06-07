import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';

import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';
import Label from 'shared/label';

export function handleLoginClick() {
  const next = encodeURIComponent(window.location.href);
  window.location.assign(`${window.location.origin}/login?next=${next}`);
}

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
    <div className="app-Navbar">
      {isLoggedIn && (
        <header>
          <h4>{userName}</h4>
          <a href={`/logout?next=${window.location.origin}`}>
            <Label
              className="app-Navbar__logout-button"
              shape="rounded"
              size="small"
              theme="inverse"
            >
              {t('Navbar.logout')}
            </Label>
          </a>
        </header>
      )}
      <Nav stacked>
        <LinkContainer to={getSearchPageUrl()}>
          <NavItem onClick={clearSearchResults}>
            <Glyphicon glyph="search" /> {t('Navbar.search')}
          </NavItem>
        </LinkContainer>
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
        {!isLoggedIn && (
          <NavItem onClick={handleLoginClick}>
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
    </div>
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
