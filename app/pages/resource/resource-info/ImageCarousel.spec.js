import { shallow } from 'enzyme';
import React from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';
import Immutable from 'seamless-immutable';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import ImageCarousel from './ImageCarousel';

describe('pages/resource/resource-info/ImageCarousel', () => {
  const images = [
    Image.build(),
    Image.build({ caption: null }),
  ];
  const defaultProps = {
    altText: 'Some alt text',
    images: Immutable(images),
  };

  function getWrapper(extraProps) {
    return shallow(<ImageCarousel {...defaultProps} {...extraProps} />);
  }

  describe('Carousel', () => {
    describe('when there are multiple images in the carousel', () => {
      let carousel;

      beforeAll(() => {
        carousel = getWrapper().find(Carousel);
      });

      test('is rendered', () => {
        expect(carousel.length).toBe(1);
      });

      test('does not have indicators', () => {
        expect(carousel.prop('indicators')).toBe(false);
      });

      test('has controls', () => {
        expect(carousel.prop('controls')).toBe(true);
      });
    });

    describe('when there is only one image in the carousel', () => {
      let carousel;

      beforeAll(() => {
        carousel = getWrapper({ images: [Image.build()] }).find(Carousel);
      });

      test('is rendered', () => {
        expect(carousel.length).toBe(1);
      });

      test('does not have indicators', () => {
        expect(carousel.prop('indicators')).toBe(false);
      });

      test('has controls', () => {
        expect(carousel.prop('controls')).toBe(false);
      });
    });
  });

  describe('Carousel items', () => {
    test('renders a Carousel.Item for each image in props', () => {
      const carouselItems = getWrapper().find(Carousel.Item);
      expect(carouselItems.length).toBe(defaultProps.images.length);
    });

    describe('BackgroundImage component', () => {
      test('exists for each item', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem) => {
          const backgroundImage = carouselItem.find(BackgroundImage);

          expect(backgroundImage.length).toBe(1);
        });
      });

      test('has correct image prop', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem, index) => {
          const backgroundImage = carouselItem.find(BackgroundImage);

          expect(backgroundImage.prop('image')).toEqual(defaultProps.images[index]);
        });
      });
    });
  });
});
