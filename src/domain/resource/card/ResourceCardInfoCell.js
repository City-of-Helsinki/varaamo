import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ResourceCardInfoCellWrapper = ({ onClick, children, ...props }) => (
  onClick ? <Button {...props}>{children}</Button> : <span {...props}>{children}</span>
);

ResourceCardInfoCellWrapper.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

function ResourceCardInfoCell({
  className,
  alt,
  icon,
  onClick,
  text,
}) {
  const imgAlt = (alt || text) || '';

  return (
    <ResourceCardInfoCellWrapper
      className={classNames('app-resourceCardInfoCell', className)}
      onClick={onClick}
    >
      <img
        alt={imgAlt}
        className="app-resourceCardInfoCell__icon"
        src={icon}
      />
      {!!text && <span>{text}</span>}
    </ResourceCardInfoCellWrapper>
  );
}

ResourceCardInfoCell.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

export default ResourceCardInfoCell;
