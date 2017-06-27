import React, { PropTypes } from 'react';

import FooterContent from './FooterContent';

function Footer({ onLinkClick }) {
  return (
    <footer>
      <FooterContent onLinkClick={onLinkClick} />
    </footer>
  );
}

Footer.propTypes = {
  onLinkClick: PropTypes.func,
};

export default Footer;
