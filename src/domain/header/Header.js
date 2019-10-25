import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Sticky from 'react-sticky-el';

import MainNavbar from './MainNavbarContainer';
import TopNavbar from './TopNavbarContainer';

function Header({ children, location }) {
  const { pathname } = location;
  const activeLink = pathname === '/' ? 'home' : pathname.replace('/', '');
  const [isFixed, setIsFixed] = useState(false);
  return (
    <div className="app-Header">
      <TopNavbar />
      <Sticky
        onFixedToggle={fixed => setIsFixed(!fixed)}
      >
        <MainNavbar
          activeLink={activeLink}
          isFixed={isFixed}
        />
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
