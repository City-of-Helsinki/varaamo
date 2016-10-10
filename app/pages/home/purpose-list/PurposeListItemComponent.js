import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function PurposeListItemComponent({ imageUrl, linkUrl, text }) {
  return (
    <div className="purpose-list-item">
      <Link to={linkUrl}>
        <img alt={text} src={imageUrl} />
        <p>{text}</p>
      </Link>
    </div>
  );
}

PurposeListItemComponent.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default PurposeListItemComponent;
