import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

function FavoriteButton({ favorited, onClick }) {
  return (
    <button
      className="favorite-button"
      onClick={onClick}
    >
      { favorited ?
        <Glyphicon glyph="star" /> :
          <Glyphicon glyph="star-empty" />
      }
    </button>
  );
}

FavoriteButton.propTypes = {
  favorited: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FavoriteButton;
