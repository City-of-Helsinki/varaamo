import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';
import Immutable from 'seamless-immutable';

import Image from 'fixtures/Image';
import { getCaption } from 'utils/imageUtils';
import ImageCarousel from './ImageCarousel';

describe('screens/resource/resource-info/ImageCarousel', () => {
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
    it('is rendered', () => {
      const carousel = getWrapper().find(Carousel);

      expect(carousel.length).to.equal(1);
    });

    it('has indicators if there are multiple images in the carousel', () => {
      const carousel = getWrapper().find(Carousel);

      expect(carousel.prop('indicators')).to.equal(true);
    });

    it('does not have indicators if there is only one image in the carousel', () => {
      const carousel = getWrapper({ images: [Image.build()] }).find(Carousel);

      expect(carousel.prop('indicators')).to.equal(false);
    });
  });

  describe('Carousel items', () => {
    it('renders a Carousel.Item for each image in props', () => {
      const carouselItems = getWrapper().find(Carousel.Item);
      expect(carouselItems.length).to.equal(defaultProps.images.length);
    });

    describe('image', () => {
      it('exists for each item', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem, index) => {
          const img = carouselItem.find('img');

          expect(img.length).to.equal(1);
          expect(img.prop('src')).to.contain(defaultProps.images[index].url);
        });
      });

      it('has correct src', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem, index) => {
          const img = carouselItem.find('img');

          expect(img.prop('src')).to.contain(defaultProps.images[index].url);
        });
      });

      it('has correct alt text', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem, index) => {
          const img = carouselItem.find('img');
          const expectedAltText = getCaption(images[index]) || defaultProps.altText;

          expect(img.prop('alt')).to.contain(expectedAltText);
        });
      });
    });
  });
});
