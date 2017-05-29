import React, { PropTypes } from 'react';

Label.propTypes = {
  children: PropTypes.node.isRequired,
  shape: PropTypes.oneOf(['default', 'rounded', 'circle']),
  size: PropTypes.oneOf(['medium', 'small', 'mini']),
  theme: PropTypes.string,
};

Label.defaultProps = {
  shape: 'default',
  size: 'medium',
  theme: 'gray',
};

function Label({ children, shape, size, theme }) {
  return (
    <div
      className={
        `app-Label app-Label--shape-${shape} app-Label--size-${size} app-Label--theme-${theme}`
      }
    >
      {children}
    </div>
  );
}

export default Label;
