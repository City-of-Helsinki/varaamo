import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import FAIcon from '../../../app/shared/fontawesome-icon/FontAwesomeIcon';
import injectT from '../../../app/i18n/injectT';
import { getSearchPageUrl } from '../../../app/utils/searchUtils';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  collapseItem() {
    this.setState({ expanded: false });
  }

  toggleCollapse() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const {
      activeLink,
      clearSearchResults,
      isAdmin,
      isLoggedIn,
      t,
      isFixed,
    } = this.props;
    return (
      <Navbar
        className="app-MainNavbar"
        expanded={this.state.expanded}
        fluid
        onToggle={() => this.toggleCollapse()}
      >
        <Navbar.Header>
          <Navbar.Toggle />
          <Navbar.Brand>
            <Link className={`helsinki-logo ${isFixed ? '' : 'hidden'}`} to="/">
              <span className="brand-logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Brand>
            <Link to="/">Varaamo</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey={activeLink}>
            <LinkContainer to={getSearchPageUrl()}>
              <NavItem
                eventKey="search"
                onClick={() => {
                  this.collapseItem();
                  clearSearchResults();
                }}
              >
                {t('Navbar.search')}
              </NavItem>
            </LinkContainer>
            {isLoggedIn && (
              <LinkContainer to="/admin-resources">
                <NavItem eventKey="admin-resources" onClick={() => this.collapseItem()}>
                  {isAdmin ? t('Navbar.adminResources') : t('Navbar.userFavorites')}
                </NavItem>
              </LinkContainer>
            )}
            {isLoggedIn && (
              <LinkContainer to="/my-reservations">
                <NavItem eventKey="my-reservations" onClick={() => this.collapseItem()}>
                  {t('Navbar.userResources')}
                </NavItem>
              </LinkContainer>
            )}
            {isAdmin
              && (
                <Fragment>
                  <LinkContainer to="/manage-reservations">
                    <NavItem eventKey="manage-reservations" onClick={() => this.collapseItem()}>
                      {t('Navbar.manageReservations')}
                    </NavItem>
                  </LinkContainer>
                  <NavItem eventKey="adminMaintenance" href="https://api.hel.fi/respa/ra/" target="_blank">
                    {t('Navbar.adminMaintenance')}
                    <FAIcon icon={faExternalLinkAlt} />
                  </NavItem>

                  <NavItem eventKey="adminGuide" href="https://cityofhelsinki.gitbook.io/varaamo" target="_blank">
                    {t('Navbar.adminGuide')}
                    <FAIcon icon={faExternalLinkAlt} />
                  </NavItem>
                </Fragment>
              )
            }
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
  isFixed: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MainNavbar);
