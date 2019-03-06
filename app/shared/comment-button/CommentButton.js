import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

function CommentButton({ onClick }) {
  return (
    <button
      className="comment-button"
      onClick={onClick}
      type="button"
    >
      <Glyphicon glyph="comment" />
    </button>
  );
}

CommentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CommentButton;
