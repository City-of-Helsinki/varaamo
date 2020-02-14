import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';

import AsPolymorph from '../as-polymorph/AsPolymorph';

const ALLOWED_TYPES = ['a', 'button'];
const BUTTON_PROPS = ['type'];
const LINK_PROPS = ['href'];

function getProps(props) {
  switch (props.as) {
    case 'a': {
      const linkCompatibleProps = omit(props, BUTTON_PROPS);

      return { ...linkCompatibleProps };
    }
    case 'button':
      const defaultProps = {
        type: 'button',
      };
      const buttonCompatibleProps = omit(props, LINK_PROPS);

      return { ...defaultProps, ...buttonCompatibleProps };
    default:
      return null;
  }
}

function NavItem(props) {
  if (!ALLOWED_TYPES.includes(props.as)) {
    return null;
  }
  const typeProps = getProps(props);

  return (
    <li><AsPolymorph {...typeProps} /></li>
  );
}

NavItem.propTypes = {
  // If your item does not have a href, you should probably use a button.
  // Currently our style rules target the anchor element which has likely forced
  // the devs to use anchors where they are not needed. I wanted to add support
  // for the button variant right from the start in order to avoid creating
  // further obstacles for using button.
  as: PropTypes.oneOf(ALLOWED_TYPES),
};

NavItem.defaultProps = {
  as: ALLOWED_TYPES[0],
};

export default NavItem;
