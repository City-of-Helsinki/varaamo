import React, { PropTypes } from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';

import { getCaption } from 'utils/imageUtils';

const IMAGE_WIDTH = 700;
const IMAGE_HEIGHT = 420;

function renderCarouselItem(image, altText) {
  const imageAlt = getCaption(image) || altText;
  const imageSrc = `${image.url}?dim=${IMAGE_WIDTH}x${IMAGE_HEIGHT}`;
  return (
    <Carousel.Item key={image.url}>
      <img
        alt={imageAlt}
        src={imageSrc}
        style={{ backgroundColor: '#ccc', height: IMAGE_HEIGHT, width: IMAGE_WIDTH }}
      />
    </Carousel.Item>
  );
}

function ImageCarousel({ images, altText }) {
  return (
    <Carousel
      className="image-carousel"
      controls={images.length > 1}
      indicators={images.length > 1}
      interval={7000}
      style={{ maxWidth: IMAGE_WIDTH }}
    >
      {images.map(image => renderCarouselItem(image, altText))}
    </Carousel>
  );
}

ImageCarousel.propTypes = {
  altText: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
};

export default ImageCarousel;
