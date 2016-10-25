import React, { PropTypes } from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';

const carouselInterval = 7000;

function renderCarouselItem(image) {
  return (
    <Carousel.Item key={image.url}>
      <div
        className="image-container"
        style={{ backgroundImage: `url(${image.url})` }}
      />
    </Carousel.Item>
  );
}

function ImageCarousel({ images }) {
  return (
    <Carousel
      className="image-carousel"
      controls={images.length > 1}
      indicators={images.length > 1}
      interval={carouselInterval}
    >
      {images.map(renderCarouselItem)}
    </Carousel>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageCarousel;
