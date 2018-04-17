import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
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
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey="none" id="user-nav" pullRight>
            {isLoggedIn && (
              <NavItem href={`/logout?next=${window.location.origin}`}>
                {t('Navbar.logout')}
              </NavItem>
            )}
            {!isLoggedIn && (
              <NavItem id="app-Navbar__login" onClick={this.handleLoginClick}>
                {t('Navbar.login')}
              </NavItem>
            )}
          </Nav>
          <Navbar.Text pullRight>
            <img className="app-TopNavbar__icon" role="presentation" src={iconUser} />
            {isLoggedIn &&
              <span className="app-TopNavbar__user">{userName}</span>
            }
          </Navbar.Text>
          <Nav activeKey="none" id="language-nav" onSelect={changeLocale} pullRight>
            {currentLanguage !== 'en' && <NavItem eventKey="en">
              EN
            </NavItem>}
            {currentLanguage !== 'fi' && <NavItem eventKey="fi">
              FI
            </NavItem>}
            {currentLanguage !== 'sv' && <NavItem eventKey="sv">
              SV
            </NavItem>}
          </Nav>
          <Navbar.Text pullRight>
            <img className="app-TopNavbar__icon" role="presentation" src={iconGlobe} />
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default injectT(TopNavbar);

/*

export function handleLoginClick() {
  const next = encodeURIComponent(window.location.href);
  window.location.assign(`${window.location.origin}/login?next=${next}`);
}

function TopNavbar(props) {
  const {
    changeLocale,
    currentLanguage,
    isLoggedIn,
    t,
    userName,
  } = props;

  return (
    <Navbar className="app-TopNavbar" fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">
            <span className="brand-logo" />
          </Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav id="user-nav" pullRight>
          <Navbar.Text>
            <img className="app-TopNavbar__icon" role="presentation" src={iconUser} />
            {isLoggedIn &&
              <span className="app-TopNavbar__user">{userName}</span>
            }
          </Navbar.Text>
          {isLoggedIn && (
            <NavItem href={`/logout?next=${window.location.origin}`}>
              {t('Navbar.logout')}
            </NavItem>
          )}
          {!isLoggedIn && (
            <NavItem id="app-Navbar__login" onClick={handleLoginClick}>
              {t('Navbar.login')}
            </NavItem>
          )}
        </Nav>
        <Nav id="language-nav" onSelect={changeLocale} pullRight>
          <Navbar.Text>
            <img className="app-TopNavbar__icon" role="presentation" src={iconGlobe} />
          </Navbar.Text>
          {currentLanguage !== 'en' && <NavItem eventKey="en">
            EN
          </NavItem>}
          {currentLanguage !== 'fi' && <NavItem eventKey="fi">
            FI
          </NavItem>}
          {currentLanguage !== 'sv' && <NavItem eventKey="sv">
            SV
          </NavItem>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

TopNavbar.propTypes = {
  changeLocale: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

export default injectT(TopNavbar);
*/
