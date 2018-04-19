import React, { PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

function MainNavbar(props) {
  const {
    activeLink,
    clearSearchResults,
    isAdmin,
    isLoggedIn,
    t,
  } = props;

  return (
    <Navbar className="app-MainNavbar" fluid>
      <Navbar.Header>
        <Navbar.Brand>Varaamo</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav activeKey={activeLink}>
          <NavItem eventKey="home" href="/">
            {t('Navbar.homeLink')}
          </NavItem>
          <NavItem eventKey="search" href={getSearchPageUrl()} onClick={clearSearchResults}>
            {t('Navbar.search')}
          </NavItem>
          {isAdmin && (
            <NavItem eventKey="admin-resources" href="/admin-resources">
              {t('Navbar.adminResources')}
            </NavItem>
          )}
          {isLoggedIn && (
            <NavItem eventKey="my-reservations" href="/my-reservations">
              {t('Navbar.userResources')}
            </NavItem>
          )}
          <NavItem eventKey="about" href="/about">
            {t('Navbar.aboutLink')}
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

MainNavbar.propTypes = {
  activeLink: PropTypes.string.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MainNavbar);
