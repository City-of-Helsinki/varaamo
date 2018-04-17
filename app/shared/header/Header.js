import React, { PropTypes } from 'react';

import MainNavbar from 'shared/main-navbar';
import TopNavbar from 'shared/top-navbar';

function Header({ children, location }) {
  const { pathname } = location;
  return (
    <div className="app-Header">
      <TopNavbar />
      <MainNavbar activeLink={pathname} />
      {children}
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Header;
