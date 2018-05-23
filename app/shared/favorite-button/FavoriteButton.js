import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import { injectT } from 'i18n';

function FavoriteButton({ favorited, onClick, t }) {
  const buttonText = t(`ResourceHeader.${favorited ? 'favoriteRemoveButton' : 'favoriteAddButton'}`);
  return (
    <Button className="favorite-button" onClick={onClick}>
      <img alt={buttonText} className="favorite-button-icon" src={iconHeart} />
      <span>{buttonText}</span>
    </Button>
  );
}

FavoriteButton.propTypes = {
  favorited: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

FavoriteButton = injectT(FavoriteButton);  // eslint-disable-line

export default FavoriteButton;
