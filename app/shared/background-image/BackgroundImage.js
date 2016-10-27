import React, { PropTypes } from 'react';

function BackgroundImage({ children, image, height, width }) {
  const dimensions = height && width ? `dim=${width}x${height}` : '';
  const imageUrl = dimensions ? `${image.url}?${dimensions}` : image.url;
  const style = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  return (
    <div className="image-container" style={style}>
      {children}
    </div>
  );
}

BackgroundImage.propTypes = {
  children: PropTypes.node,
  image: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default BackgroundImage;
