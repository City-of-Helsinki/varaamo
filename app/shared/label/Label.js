import React, { PropTypes } from 'react';
import classnames from 'classnames';

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  shape: PropTypes.oneOf(['default', 'rounded', 'circle']),
  size: PropTypes.oneOf(['medium', 'small', 'mini']),
  theme: PropTypes.string,
};

Label.defaultProps = {
  shape: 'default',
  size: 'medium',
  theme: 'gray',
};

function Label({ children, className, shape, size, theme }) {
  return (
    <div
      className={classnames(
        `app-Label app-Label--shape-${shape} app-Label--size-${size} app-Label--theme-${theme}`,
        className
      )}
    >
      {children}
    </div>
  );
}

export default Label;
