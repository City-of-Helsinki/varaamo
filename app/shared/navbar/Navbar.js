import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';

import finlandFlagSrc from 'assets/flags/fi.svg';
import swedenFlagSrc from 'assets/flags/sv.svg';
import englandFlagSrc from 'assets/flags/gb.svg';
import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

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
    onNavItemClick,
    t,
    userName,
  } = props;

  const onSearchNavItemClick = () => {
    onNavItemClick();
    clearSearchResults();
  };

  const onLoginNavItemClick = () => {
    onNavItemClick();
    handleLoginClick();
  };

  return (
    <div className="app-Navbar">
      <Nav id="language-nav" onSelect={changeLocale}>
        {currentLanguage !== 'en' && <NavItem eventKey="en" onClick={onNavItemClick}>
          <img
            alt={t('Navbar.language-english')}
            src={englandFlagSrc}
          />
        </NavItem>}
        {currentLanguage !== 'fi' && <NavItem eventKey="fi" onClick={onNavItemClick}>
          <img
            alt={t('Navbar.language-finnish')}
            src={finlandFlagSrc}
          />
        </NavItem>}
        {currentLanguage !== 'sv' && <NavItem eventKey="sv" onClick={onNavItemClick}>
          <img
            alt={t('Navbar.language-swedish')}
            src={swedenFlagSrc}
          />
        </NavItem>}
      </Nav>
      <div className="main-nav">
        {isLoggedIn ?
          <h4>{userName}</h4> :
            <h2>{t('Navbar.header')}</h2>
        }
        <Nav id="main-nav" stacked>
          {isLoggedIn && (
            <NavItem
              href={`/logout?next=${window.location.origin}`}
              onClick={onNavItemClick}
            >
                {t('Navbar.logout')}
            </NavItem>
          )}
          {!isLoggedIn && (
            <NavItem id="app-Navbar__login" onClick={onLoginNavItemClick}>
              {t('Navbar.login')}
            </NavItem>
          )}
          <LinkContainer to={getSearchPageUrl()}>
            <NavItem onClick={onSearchNavItemClick}>
              <Glyphicon glyph="search" /> {t('Navbar.search')}
            </NavItem>
          </LinkContainer>
          {isAdmin && (
            <LinkContainer to="/admin-resources">
              <NavItem onClick={onNavItemClick}>
                {t('Navbar.adminResources')}
              </NavItem>
            </LinkContainer>
          )}
          {isLoggedIn && (
            <LinkContainer to="/my-reservations">
              <NavItem onClick={onNavItemClick}>
                {t('Navbar.userResources')}
              </NavItem>
            </LinkContainer>
          )}
          <LinkContainer to="/about">
            <NavItem className="about-link" onClick={onNavItemClick}>
              {t('Navbar.aboutLink')}
            </NavItem>
          </LinkContainer>
        </Nav>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  changeLocale: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onNavItemClick: PropTypes.func,
  t: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
  onNavItemClick: () => {},
};

export default injectT(Navbar);
