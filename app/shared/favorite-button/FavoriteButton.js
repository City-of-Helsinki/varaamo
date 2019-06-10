import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import classNames from 'classnames';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import iconHeartWhite from '../../assets/icons/heart-white.svg';
import injectT from '../../i18n/injectT';

function FavoriteButton({ favorited, onClick, t }) {
  const buttonClassNames = classNames('favorite-button', {
    'favorite-button--favorite': favorited,
  });
  const buttonText = t(
    `ResourceHeader.${favorited ? 'favoriteRemoveButton' : 'favoriteAddButton'}`
  );
  return (
    <Button className={buttonClassNames} onClick={onClick}>
      <img
        alt={buttonText}
        className="favorite-button__icon"
        src={favorited ? iconHeartWhite : iconHeart}
      />
      <span>{buttonText}</span>
    </Button>
  );
}

FavoriteButton.propTypes = {
  favorited: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

FavoriteButton = injectT(FavoriteButton); // eslint-disable-line

export default FavoriteButton;
