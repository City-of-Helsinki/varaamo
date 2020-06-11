import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

function FAIcon({ className, ...rest }) {
  return (
    <Icon className={classNames('app-fontAwesome', className)} {...rest} />
  );
}

FAIcon.propTypes = {
  className: PropTypes.string,
};

export default FAIcon;
