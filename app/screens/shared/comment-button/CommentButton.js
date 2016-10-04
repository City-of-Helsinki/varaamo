import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

function CommentButton({ onClick }) {
  return (
    <button
      className="comment-button"
      onClick={onClick}
    >
      <Glyphicon glyph="comment" />
    </button>
  );
}

CommentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CommentButton;
