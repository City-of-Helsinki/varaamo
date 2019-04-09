import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import BootstrapLabel from 'react-bootstrap/lib/Label';

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function Label({
  children, className, ...rest
}) {
  return (
    <div
      className={classnames(
        'app-Label',
        className
      )}
    >
      <BootstrapLabel {...rest}>
        {children}
      </BootstrapLabel>
    </div>
  );
}

export default Label;
