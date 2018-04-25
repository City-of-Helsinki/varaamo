import React, { PropTypes } from 'react';
import Sticky from 'react-sticky-el';

import MainNavbar from 'shared/main-navbar';
import TopNavbar from 'shared/top-navbar';

function Header({ children, location }) {
  const { pathname } = location;
  const activeLink = pathname === '/' ? 'home' : pathname.replace('/', '');
  return (
    <div className="app-Header">
      <TopNavbar />
      <Sticky>
        <MainNavbar activeLink={activeLink} />
      </Sticky>
      {children}
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Header;
