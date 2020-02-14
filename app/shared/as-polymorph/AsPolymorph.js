import React from 'react';
import PropTypes from 'prop-types';

const AsPolymorph = React.forwardRef(({ as, children, ...props }, ref) => {
  return React.createElement(as, { ...props, ref }, children);
});

AsPolymorph.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
};

AsPolymorph.defaultProps = {
  as: 'div',
};

export default AsPolymorph;
