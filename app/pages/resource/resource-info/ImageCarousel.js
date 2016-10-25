import React, { PropTypes } from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';

const IMAGE_WIDTH = 700;
const IMAGE_HEIGHT = 420;

function renderCarouselItem(image) {
  return (
    <Carousel.Item key={image.url}>
      <div
        style={{
          backgroundColor: '#ccc',
          backgroundImage: `url(${image.url})`,
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
          height: IMAGE_HEIGHT,
          width: IMAGE_WIDTH,
        }}
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
      interval={7000}
      style={{ maxWidth: IMAGE_WIDTH }}
    >
      {images.map(renderCarouselItem)}
    </Carousel>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageCarousel;
