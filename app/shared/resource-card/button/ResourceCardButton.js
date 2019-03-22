import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';

function ResourceCardIcon({
  className, alt, icon, label, labelClassname, onClick
}) {
  return (
    <Button onClick={onClick}>
      <img
        alt={alt}
        className
        src={icon}
      />
      <span className={labelClassname}>
        {label}
      </span>
    </Button>
  );
}

ResourceCardIcon.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,

};

export default ResourceCardIcon;
