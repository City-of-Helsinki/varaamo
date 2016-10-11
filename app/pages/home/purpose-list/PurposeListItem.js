import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function PurposeListItem({ imageUrl, linkUrl, text }) {
  return (
    <div className="purpose-list-item">
      <Link to={linkUrl}>
        <img alt={text} src={imageUrl} />
        <p>{text}</p>
      </Link>
    </div>
  );
}

PurposeListItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default PurposeListItem;
