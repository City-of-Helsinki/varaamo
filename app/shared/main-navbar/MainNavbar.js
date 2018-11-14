import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navCollapsed: true,
    };
  }

  collapseItem() {
    this.setState({ navCollapsed: true });
  }

  toggleCollapse() {
    this.setState({ navCollapsed: !this.state.navCollapsed });
  }

  render() {
    const {
      activeLink,
      clearSearchResults,
      isAdmin,
      isLoggedIn,
      t,
    } = this.props;

    return (
      <Navbar className="app-MainNavbar" fluid>
        <Navbar.Header>
          <Navbar.Toggle />
          <Navbar.Brand>
            <Link to="/">
              Varaamo
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse collapsed={this.state.navCollapsed} onToggle={() => this.toggleCollapse()}>
          <Nav activeKey={activeLink}>
            <LinkContainer to={getSearchPageUrl()}>
              <NavItem eventKey="search" onClick={clearSearchResults}>
                {t('Navbar.search')}
              </NavItem>
            </LinkContainer>
            {isLoggedIn && (
              <LinkContainer to="/admin-resources">
                <NavItem eventKey="admin-resources">
                  { isAdmin ? t('Navbar.adminResources') : t('Navbar.userFavorites') }
                </NavItem>
              </LinkContainer>
            )}
            {isLoggedIn && (
              <LinkContainer to="/my-reservations">
                <NavItem eventKey="my-reservations">
                  {t('Navbar.userResources')}
                </NavItem>
              </LinkContainer>
            )}
            <LinkContainer to="/about">
              <NavItem eventKey="about" onClick={() => this.collapseItem()}>
                {t('Navbar.aboutLink')}
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

MainNavbar.propTypes = {
  activeLink: PropTypes.string.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MainNavbar);
