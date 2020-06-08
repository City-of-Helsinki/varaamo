import PropTypes from 'prop-types';
import React from 'react';
import Sticky from 'react-sticky-el';

import FontSizes from '../../../app/constants/FontSizes';
import MainNavbar from './MainNavbarContainer';
import TopNavbar from './TopNavbarContainer';

function Header({
  children, location, fontSize, setFontSize,
}) {
  const { pathname } = location;
  const activeLink = pathname === '/' ? 'home' : pathname.replace('/', '');
  return (
    <div className="app-Header">
      <TopNavbar fontSize={fontSize} setFontSize={setFontSize} />
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
  fontSize: PropTypes.oneOf(Object.values(FontSizes)).isRequired,
  setFontSize: PropTypes.func.isRequired,
};

export default Header;
